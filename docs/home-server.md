# Home Server Deployment Guide

This guide explains how to deploy the GitOps project on an Ubuntu home server using `k3s`, `Tailscale`, and `ArgoCD`.

## 1. Prepare Ubuntu

Install updates and required packages:

```bash
sudo apt update
sudo apt upgrade -y
sudo apt install -y curl git
```

## 2. Install k3s

Install k3s with a single command:

```bash
curl -sfL https://get.k3s.io | sh -
```

Verify k3s is running:

```bash
sudo kubectl get nodes
```

The kubeconfig is available at `/etc/rancher/k3s/k3s.yaml`.

## 3. Install Tailscale

Use Tailscale to connect your home server to your laptop or remote network:

```bash
curl -fsSL https://tailscale.com/install.sh | sh
sudo tailscale up
```

Follow the login flow shown in the terminal. Tailscale gives your server a stable private IP.

## 4. Install ArgoCD

Install ArgoCD in the `argocd` namespace:

```bash
kubectl create namespace argocd
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
```

Forward the ArgoCD server port to localhost:

```bash
kubectl port-forward svc/argocd-server -n argocd 8080:443
```

Access the UI at `https://localhost:8080`.

## 5. Get ArgoCD credentials

Retrieve the default admin password:

```bash
kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 --decode
```

## 6. Configure GitOps repo in ArgoCD

Update `infra/argocd/gitops-app.yaml` with your repository URL and push it to GitHub.

Then apply it from your server:

```bash
kubectl apply -f infra/argocd/gitops-app.yaml
```

ArgoCD will pull manifests from `infra/k8s` and deploy the `gitops` namespace.

## 7. Install a load balancer / ingress

For a home server, use the built-in k3s service load balancer and NodePort. If you want an ingress, install Traefik or Nginx ingress.

### NodePort access

The frontend service is exposed on `30080`. Access it via:

```bash
http://<server-ip>:30080
```

### Ingress example (optional)

If you install an ingress controller, create an ingress manifest for the frontend.

## 8. Build and push images

On your laptop or build machine, build and push the images:

```bash
cd /Users/saurabhkumawat/Developer/devops/gitops-project/backend
npm install
npm run build
docker build -t <dockerhub-username>/gitops-backend:latest .

docker push <dockerhub-username>/gitops-backend:latest

cd ../frontend
npm install
npm run build
docker build -t <dockerhub-username>/gitops-frontend:latest .
docker push <dockerhub-username>/gitops-frontend:latest
```

Then update `infra/k8s/*.yaml` with your Docker Hub username and let ArgoCD sync.

## 9. Verify deployment

Check pods and services:

```bash
kubectl get pods -n gitops
kubectl get svc -n gitops
```

Inspect logs:

```bash
kubectl logs -n gitops deploy/gitops-frontend
kubectl logs -n gitops deploy/gitops-backend
```

## 10. How GitOps works here

- `infra/k8s/` contains declarative Kubernetes manifests.
- `infra/argocd/gitops-app.yaml` tells ArgoCD to watch this repo path.
- ArgoCD automatically syncs the cluster state to match the repo.
- Changes in GitHub trigger ArgoCD to update the cluster.

## 11. Notes for your home server

- Use `Tailscale` if you need secure remote access to the server from another network.
- Keep the server Kubernetes node small; k3s is lightweight and good for laptops.
- If you need HTTPS, add a local ingress controller and Cert-Manager.
