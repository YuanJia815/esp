
const test = (req, res) => {
  res.status(200).json({
    message: "API working",
    method: req.method
  });
};

export default test