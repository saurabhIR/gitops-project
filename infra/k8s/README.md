# Infra Kubernetes Manifests

This folder contains the Kubernetes manifests for the GitOps project.

Files:

- `namespace.yaml` — namespace definition for `gitops`
- `postgres-deployment.yaml` — PostgreSQL Deployment, PVC, and ClusterIP Service
- `backend-deployment.yaml` — backend Deployment and ClusterIP Service
- `frontend-deployment.yaml` — frontend Deployment and NodePort Service on `30080`

## Local Minikube (default in this repo)

Manifests are set up for local images:

- Images: `gitops-backend:local`, `gitops-frontend:local`
- `imagePullPolicy: Never`
- `replicas: 1` (lighter on Minikube)

```bash
docker build -t gitops-backend:local ./backend
docker build -t gitops-frontend:local ./frontend
minikube image load gitops-backend:local
minikube image load gitops-frontend:local

kubectl apply -f infra/k8s/namespace.yaml
kubectl apply -f infra/k8s/
kubectl get pods -n gitops
minikube service gitops-frontend -n gitops
```

See [docs/minikube.md](../../docs/minikube.md) for the full Mac guide.

## Docker Hub / Argo CD images

When switching to the GitOps loop with Docker Hub, change both deployments to:

```yaml
image: <your-dockerhub-username>/gitops-backend:latest   # or gitops-frontend
imagePullPolicy: IfNotPresent
```

Then commit and let Argo CD sync.
