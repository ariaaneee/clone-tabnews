import database from "infra/database.js";

export async function status(request, response) {
  const updatedAt = new Date().toISOString();
  const queryVersion = "SELECT version()";
  const queryMaxConnections =
    "SELECT setting AS max_connections FROM pg_settings";
  const queryOpenConnections =
    "SELECT count(*) AS open_connections FROM pg_stat_activity WHERE state = 'active'";

  const [versionResponse, maxConnectionResponse, openConnectionResponse] =
    await Promise.all([
      database.query(queryVersion),
      database.query(queryMaxConnections),
      database.query(queryOpenConnections),
    ]);

  return response.status(200).json({
    updated_at: updatedAt,
    version: versionResponse.rows[0].version,
    max_connections: maxConnectionResponse.rows[0].max_connections,
    open_connections: openConnectionResponse.rows[0].open_connections,
  });
}
