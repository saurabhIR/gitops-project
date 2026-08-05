# GitOps Project

A learning GitOps demo: Next.js frontend, NestJS backend, Postgres, Kubernetes manifests, and Argo CD.

## Stack

| Path | What |
|------|------|
| `frontend/` | Next.js app + Dockerfile |
| `backend/` | NestJS API + Dockerfile |
| `infra/k8s/` | Kubernetes manifests (Minikube-friendly local images) |
| `infra/argocd/` | Argo CD Application (watches `infra/k8s`) |
| `.github/workflows/` | Build and push images to Docker Hub |
| `docs/minikube.md` | **Start here on Mac** — Minikube + Argo CD guide |
| `docs/home-server.md` | Later: Ubuntu home server with k3s |

## Quick start (Mac + Minikube)

Docker Desktop and Minikube should already be installed.

### 1. Prove the apps with Compose

```bash
cd gitops-project
docker compose up --build
```

- Frontend: http://localhost:3000  
- Backend: http://localhost:3001/message  

### 2. Deploy manually on Minikube

```bash
minikube start --driver=docker --cpus=4 --memory=6144

docker build -t gitops-backend:local ./backend
docker build -t gitops-frontend:local ./frontend
minikube image load gitops-backend:local
minikube image load gitops-frontend:local

kubectl apply -f infra/k8s/
kubectl port-forward -n gitops svc/gitops-frontend 30080:3000
```

Open http://127.0.0.1:30080

Full details: [docs/minikube.md](docs/minikube.md).

### 3. Wire Argo CD (GitOps)

1. Push this repo to GitHub.
2. Set `repoURL` in [`infra/argocd/gitops-app.yaml`](infra/argocd/gitops-app.yaml).
3. Install Argo CD and apply the Application (steps in [docs/minikube.md](docs/minikube.md#phase-3--argo-cd-gitops)).

For Docker Hub + GitHub Actions, see [docs/dockerhub-images.md](docs/dockerhub-images.md).

## Local image defaults

`infra/k8s` uses:

- `gitops-backend:local` / `gitops-frontend:local`
- `imagePullPolicy: Never`
- `replicas: 1`

That keeps Phase 2 working without a registry. Switch to Docker Hub images when you move to the full GitOps loop.

## Notes

- Frontend NodePort is `30080` (use port-forward on Mac Docker driver).
- Backend talks to `gitops-postgres` inside the cluster.
- Home-server / Tailscale / k3s is optional and documented separately — learn Minikube GitOps first.
