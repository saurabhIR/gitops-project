# Docker Hub image switch (for Argo CD GitOps)

Default manifests in `infra/k8s/` use local Minikube images:

```yaml
image: gitops-backend:local   # or gitops-frontend:local
imagePullPolicy: Never
```

When CI pushes to Docker Hub, change those two fields in:

- `infra/k8s/backend-deployment.yaml`
- `infra/k8s/frontend-deployment.yaml`

to:

```yaml
image: YOUR_DOCKERHUB_USERNAME/gitops-backend:latest
imagePullPolicy: IfNotPresent
```

(and the matching `gitops-frontend` image).

Then commit and push. Argo CD syncs the cluster to match Git.

## GitHub Actions secrets

Set on the repo:

- `DOCKERHUB_USERNAME`
- `DOCKERHUB_TOKEN`

Workflow: `.github/workflows/docker-build-push.yml`
