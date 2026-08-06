export default function Status() {
  return (
    <main style={{ fontFamily: "system-ui, sans-serif", padding: "3rem", maxWidth: "40rem" }}>
      <h1>Pipeline status</h1>
      <p>How this GitOps demo is wired:</p>
      <ol style={{ lineHeight: 1.7, paddingLeft: "1.25rem" }}>
        <li>
          <strong>App code</strong> lives in <code>frontend/</code> and{" "}
          <code>backend/</code>.
        </li>
        <li>
          <strong>Desired cluster state</strong> lives in{" "}
          <code>infra/k8s/</code> and is synced by Argo CD.
        </li>
        <li>
          <strong>Images</strong> must be rebuilt for page changes to appear in
          the cluster (local Minikube build or CI → Docker Hub).
        </li>
      </ol>
      <p style={{ marginTop: "1.5rem", color: "#444" }}>
        If you can read this page in Minikube, the frontend image was rebuilt
        and loaded successfully.
      </p>
      <p style={{ marginTop: "2rem" }}>
        <a href="/">← Home</a>
        {" · "}
        <a href="/about">About</a>
      </p>
    </main>
  );
}
