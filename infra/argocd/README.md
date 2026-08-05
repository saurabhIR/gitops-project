# Argo CD Application

This Application tells Argo CD to sync manifests from `infra/k8s` into the `gitops` namespace.

## Before you apply

1. Push this project to GitHub.
2. Edit [`gitops-app.yaml`](gitops-app.yaml) and set `spec.source.repoURL` to your real repo URL.
3. If the repo is private, add credentials in the Argo CD UI (Settings → Repositories) or via CLI.

## Install Argo CD (Minikube)

```bash
kubectl create namespace argocd
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
kubectl wait --for=condition=available deployment/argocd-server -n argocd --timeout=300s
```

## Access the UI

```bash
kubectl port-forward svc/argocd-server -n argocd 8080:443
```

Open https://localhost:8080 — username `admin`, password:

```bash
kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 --decode
echo
```

## Register the app

```bash
kubectl apply -f infra/argocd/gitops-app.yaml
```

Argo CD will pull `infra/k8s` and keep the cluster in sync. Manifest changes belong in Git — avoid `kubectl edit` as the source of truth.

## Images

Default manifests use local Minikube images (`*:local` + `imagePullPolicy: Never`). For the full CI → Docker Hub → Argo loop, see [docs/minikube.md](../../docs/minikube.md#phase-3--argo-cd-gitops).
