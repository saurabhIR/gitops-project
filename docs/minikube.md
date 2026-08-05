# Minikube GitOps Guide (Mac)

This guide walks through the local learning path on a Mac with Docker Desktop and Minikube already installed.

```text
Phase 1  docker compose          → apps work in containers
Phase 2  kubectl + local images  → apps on Minikube (manual)
Phase 3  Argo CD + GitHub        → Git is the source of truth
```

## Phase 0 — Start the cluster

```bash
# Docker Desktop must be running
minikube start --driver=docker --cpus=4 --memory=6144
minikube status
```

You will also need a GitHub repo (for Phase 3) and optionally a Docker Hub account (for CI image pushes).

## Phase 1 — Docker Compose

From the project root:

```bash
docker compose up --build
```

| Service  | URL |
|----------|-----|
| Frontend | http://localhost:3000 |
| Backend  | http://localhost:3001/message |

Stop when done exploring:

```bash
docker compose down
```

## Phase 2 — Manual deploy on Minikube

Manifests in `infra/k8s/` default to local images (`*:local`, `imagePullPolicy: Never`, `replicas: 1`).

```bash
docker build -t gitops-backend:local ./backend
docker build -t gitops-frontend:local ./frontend
minikube image load gitops-backend:local
minikube image load gitops-frontend:local

kubectl apply -f infra/k8s/namespace.yaml
kubectl apply -f infra/k8s/
kubectl get pods -n gitops
```

### Access the frontend (Docker driver on Mac)

`minikube service` needs an open tunnel with the Docker driver. Easiest option:

```bash
kubectl port-forward -n gitops svc/gitops-frontend 30080:3000
```

Then open http://127.0.0.1:30080

Or:

```bash
minikube service gitops-frontend -n gitops
```

(keep that terminal open while you browse).

### Reload images after code changes

```bash
docker build -t gitops-backend:local ./backend
minikube image load gitops-backend:local
kubectl rollout restart deployment/gitops-backend -n gitops
```

Same pattern for the frontend.

## Phase 3 — Argo CD GitOps

### Install Argo CD

```bash
kubectl create namespace argocd
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
kubectl wait --for=condition=available deployment/argocd-server -n argocd --timeout=300s
```

### UI login

```bash
kubectl port-forward svc/argocd-server -n argocd 8080:443
```

- URL: https://localhost:8080
- User: `admin`
- Password:

```bash
kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 --decode
echo
```

### Connect your GitHub repo

1. Push this project to GitHub.
2. Set `spec.source.repoURL` in [`infra/argocd/gitops-app.yaml`](../infra/argocd/gitops-app.yaml).
3. Apply the Application:

```bash
kubectl apply -f infra/argocd/gitops-app.yaml
```

Argo CD watches `infra/k8s` only (the Application manifest lives under `infra/argocd/` so it is not re-applied by itself).

### Full CI → registry → cluster loop

1. Add GitHub secrets `DOCKERHUB_USERNAME` and `DOCKERHUB_TOKEN`.
2. Switch Deployment images to Docker Hub as described in [dockerhub-images.md](dockerhub-images.md).
3. Push to `main` so Actions builds and pushes images.
4. Commit the manifest image changes; Argo CD syncs the cluster.

**GitOps rule:** change desired state in Git. Do not use `kubectl edit` as the source of truth.

## Useful commands

```bash
kubectl get pods,svc -n gitops
kubectl logs -n gitops deploy/gitops-backend
kubectl logs -n gitops deploy/gitops-frontend
kubectl get application -n argocd
minikube delete   # wipe the cluster when finished learning
```

## Next steps (optional)

After this path works: image tags with git SHA, Kustomize overlays, secrets management, Ingress, then the home-server path in [home-server.md](home-server.md).
