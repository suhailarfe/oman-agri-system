#!/bin/bash
set -e
echo "🚀 جاري تجهيز بيئة التطوير..."

if ! command -v mongod &> /dev/null; then
    curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | sudo gpg --dearmor -o /usr/share/keyrings/mongodb-server-7.0.gpg
    echo "deb [ signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] http://repo.mongodb.org/apt/debian bookworm/mongodb-org/7.0 main" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
    sudo apt-get update -qq
    sudo apt-get install -y -qq mongodb-org
fi

mkdir -p /tmp/mongodb_data
mongod --dbpath /tmp/mongodb_data --fork --logpath /tmp/mongod.log 2>/dev/null || true
echo "✅ MongoDB جاهز"

cd backend && pip install --quiet -r requirements.txt && echo "✅ Python جاهز"
cd ../frontend && npm install --silent && echo "✅ Node.js جاهز"

echo ""
echo "🎉 البيئة جاهزة! للتشغيل:"
echo "  الطرفية 1: cd backend && uvicorn main:app --host 0.0.0.0 --port 8000"
echo "  الطرفية 2: cd frontend && npm run dev"
