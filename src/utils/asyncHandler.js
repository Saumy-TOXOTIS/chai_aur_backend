// /*
// const asyncHandler = () => {}
// const asyncHandler = (fn) => {() => {}}
// const asyncHandler = (fn) => {async () => {}}
// const asyncHandler = (fn) => async () => {}
// */

// const asyncHandler = (fn) => {async () => {
//     try {
//         await fn(req,res,next);
//     } catch (error) {
//         res.status(error.code || 500).json({
//             success: false,
//             message: error.message || "Internal Server Error"
//         });
//     }
// }};

const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
    };
}

export {asyncHandler};