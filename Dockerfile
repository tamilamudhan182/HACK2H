# Smart Event Companion — Cloud Run Deployment
#
# Build: docker build -t smart-event-companion .
# Run:   docker run -p 8080:8080 smart-event-companion
# Push:  docker tag smart-event-companion gcr.io/YOUR_PROJECT_ID/smart-event-companion
#        docker push gcr.io/YOUR_PROJECT_ID/smart-event-companion
#
# Deploy to Cloud Run:
#   gcloud run deploy smart-event-companion \
#     --image gcr.io/YOUR_PROJECT_ID/smart-event-companion \
#     --platform managed \
#     --region asia-south1 \
#     --allow-unauthenticated

# ── Stage 1: Build ────────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files first to leverage layer caching
COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts

# Copy source and build
COPY . .
RUN npm run build

# ── Stage 2: Serve ────────────────────────────────────────────────────────────
FROM nginx:1.25-alpine AS runtime

# Copy built assets to Nginx web root
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom Nginx config for SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
