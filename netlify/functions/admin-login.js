exports.handler = async (event) => {
  try {
    const { email, password } = JSON.parse(event.body || "{}");

    if (
      email === process.env.ADMIN_USER &&
      password === process.env.ADMIN_PASS
    ) {
      return {
        statusCode: 200,
        body: JSON.stringify({ success: true }),
      };
    }

    return {
      statusCode: 401,
      body: JSON.stringify({ success: false }),
    };
  } catch {
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false }),
    };
  }
};
