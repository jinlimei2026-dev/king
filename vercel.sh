#!/bin/bash

if [[ $VERCEL_ENV == "production" ]]; then
  baseURL="https://${VERCEL_PROJECT_PRODUCTION_URL}"
  npm run build -- --site "$baseURL"
else
  baseURL="https://staging.${VERCEL_PROJECT_PRODUCTION_URL}"
  npm run build -- --site "$baseURL"
fi

