export const lambdaHandler = async (event, context) => {
  let response;

  try {
    if (event.httpMethod === "GET") {
      const name = event.pathParameters?.name || "Guest";
      const lang = event.queryStringParameters?.lang || "en";

      const greetings = {
        en: `Hello ${name}!`,
        es: `¡Hola ${name}!`,
        fr: `Bonjour ${name}!`,
        hi: `Namaste ${name}!`,
      };

      response = {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: greetings[lang] || greetings.en }),
      };
    } else if (event.httpMethod === "POST") {
      const body = JSON.parse(event.body || "{}");

      if (!body.name || !body.lang) {
        response = {
          statusCode: 400,
          body: JSON.stringify({ error: "Missing required fields: name, and/or lang" }),
        };
      } else {
        response = {
          statusCode: 200,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: `Welcome, ${body.name}. Your preferred language is ${body.lang}.`,
          }),
        };
      }
    } else {
      response = {
        statusCode: 405,
        body: JSON.stringify({ error: "Method Not Allowed" }),
      };
    }
  } catch (err) {
    let errorMessage = "Unknown error occurred";

    if (err instanceof Error) {
      errorMessage = err.message;
    }

    response = {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal Server Error", details: errorMessage }),
    };
  }

  return response;
};