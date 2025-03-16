const { inctance } = require("../config/razorPay");
const Course = require("../models/Course");
const User = require("../models/User");
const mailSender = require("../utils/mailSender");


//capture payment
exports.capturePayment = async (req, res) => {
  try {
    // get user and course id
    const courseId = req.body.courseId;
    const userId = req.user.id;
    // validate user

    if (!courseId || !userId) {
      return res.status(403).json({
        message: "Please fill all the fields",
        success: false,
      });
    }

    let course;
    try {
      course = await Course.findById(courseId);
      if (!course) {
        return res.status(404).json({
          message: "Course not found",
          success: false,
        });
      }

      const uid = new mongoose.Types.ObjectId(userId);
      if (course.studentEnrolled.includes(uid)) {
        return res.status(201).json({
          message: "Already enrolled in this course",
          success: false,
        });
      }
    } catch (err) {
      console.log(`error in capturePayment catch--`, err.message);
      return res.status(500).json({
        message: "Internal server error in capturePayment catch",
        success: false,
        error: err.message,
      });
    }

    //create order
    const amount = course.price;
    const currency = "INR";
    const options = {
      amount: amount * 100,
      currency: currency,
      receipt: Math.random(Date.now()).toString(),
      notes: {
        courseId: Course._id,
        userId: userId,
      },
    };

    //try to capture payment

    // intiate payment using razorpay
    const paymentResponse = await inctance.orders.create(options);
    console.log(`paymentResponse--`, paymentResponse);
    return res.status(200).json({
      message: "Payment captured successfully",
      success: true,
      currency: paymentResponse.currency,
      amount: paymentResponse.amount,
      orderId: paymentResponse.id,
      courseName: Course.courseName,
      courseDescription: Course.courseDescription,
      thumbnail: Course.thumbnail,
    });
  } catch (err) {
    console.log(`error in capturePayment--`, err.message);
    return res.status(500).json({
      message: "Internal server error in capturePayment",
      success: false,
      error: err.message,
    });
  }
};

// verify payment signature

exports.verifySignature = async (req, res) => {
  try {
    //
    const webHookSecret = process.env.WEB_HOOK_SECRET;
    const signature = req.headers["x-razorpay-signature"];
    const shaSum = crypto.createHmac("sha256", webHookSecret);
    shaSum.update(JSON.stringify(req.body));
    const digest = shaSum.digest("hex");

    if (signature === digest) {
      console.log(`payment is verified--`);

      // action items
      const { courseId, userId } = req.body.payload.payment.entity.notes;

      try {
        // find the course and fulfill the user
        const enrolledCourse = await Course.findById(
          { _id: courseId },
          {
            $push: {
              studentEnrolled: userId,
            },
          },
          { new: true }
        );
        console.log(`enrolledCourse--`, enrolledCourse);
        if (!enrolledCourse) {
          return res.status(500).json({
            message: "Course not found",
            success: false,
          });
        }

        // find the user and fulfill the course - enrolled course
        const enrolledUser = await User.findById(
          { _id: userId },
          {
            $push: {
              courses: courseId,
            },
          },
          { new: true }
        );
        console.log(`enrolledUser--`, enrolledUser);

        // send course registration email
        const emailResponse = await mailSender(
          enrolledUser.email,
          "Course Registration",
          `<html>
                    <body>
                        <h1>Congratulations! You have successfully enrolled in ${enrolledCourse.courseName}</h1>
                        <p>Thank you for joining us. We hope you enjoy the course.</p>
                        <p>Best Regards,</p>
                        <p>The ${enrolledCourse.courseName} Team</p>
                </html>`
        );

        return res.status(200).json({
          message: "Payment verified successfully and course enrolled",
          success: true,
        });
      } catch (err) {
        // if signature is not verified
        console.log(`error in verifying Signature--`, err.message);
        return res.status(400).json({
          message: "Internal server error in verifying Signature",
          success: false,
          error: err.message,
        });
      }
    }
  } catch (err) {
    console.log(`error in verifySignature--`, err.message);
    return res.status(500).json({
      message: "Internal server error in verifySignature",
      success: false,
      error: err.message,
    });
  }
};
