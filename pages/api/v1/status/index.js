import database from "infra/database.js";

async function status(request, response) {
  const updatedAt = new Date().toISOString();

  const queryVersion = "SHOW server_version;";

  const queryMaxConnections = "SHOW max_connections;";

  const databaseName = process.env.POSTGRES_DB;
  const queryOpenConnections = {
    text: "SELECT count(*) AS open_connections FROM pg_stat_activity WHERE datname = $1;",
    values: [databaseName],
  };

  const [versionResponse, maxConnectionResponse, openConnectionResponse] =
    await Promise.all([
      database.query(queryVersion),
      database.query(queryMaxConnections),
      database.query(queryOpenConnections),
    ]);

  const data = {
    updated_at: updatedAt,
    dependencies: {
      database: {
        version: versionResponse.rows[0].server_version,
        max_connections: parseInt(
          maxConnectionResponse.rows[0].max_connections,
        ),
        open_connections: parseInt(
          openConnectionResponse.rows[0].open_connections,
        ),
      },
    },
  };

  return response.status(200).json(data);
}

export default status;
