export default function About() {
  return (
    <main style={{ fontFamily: "system-ui, sans-serif", padding: "3rem" }}>
      <h1>About</h1>
      <p>
        This is a static page added to demonstrate a frontend change in the
        GitOps learning project.
      </p>
      <p>
        Manifest changes (like replica counts) are synced by Argo CD from Git.
        App code changes need a new container image before pods show the update.
      </p>
      <p style={{ marginTop: "2rem" }}>
        <a href="/">← Home</a>
        {" · "}
        <a href="/status">Pipeline status</a>
      </p>
    </main>
  );
}
