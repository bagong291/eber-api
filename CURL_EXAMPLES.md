# 🚀 Contoh cURL - Upload File API (No Authentication!)

Semua endpoint bisa digunakan tanpa token/authentication! 🎉

---

## 💬 Email Sender API (Unified Endpoint)

### 1. Send Contact Message
```bash
curl -X POST http://localhost:3022/api/v1/email/send/contact \
  -H "Content-Type: application/json" \
  -d '{
    "firstname": "John",
    "lastname": "Doe",
    "email": "john@example.com",
    "message": "Hello! I would like to inquire about your products and services."
  }'
```

**Response:**
```json
{
  "status": "success",
  "message": "Your message has been sent successfully!",
  "data": {
    "emailSent": true,
    "sender": {
      "name": "John Doe",
      "email": "john@example.com"
    },
    "type": "contact",
    "timestamp": "2026-01-15T10:30:00.000Z"
  }
}
```

### 2. Send Custom Product Request
```bash
curl -X POST http://localhost:3022/api/v1/email/send/custom-product \
  -H "Content-Type: application/json" \
  -d '{
    "firstname": "Jane",
    "lastname": "Smith",
    "email": "jane@example.com",
    "message": "I need custom packaging for 5000 units with company logo."
  }'
```

**Response:**
```json
{
  "status": "success",
  "message": "Your message has been sent successfully!",
  "data": {
    "emailSent": true,
    "sender": {
      "name": "Jane Smith",
      "email": "jane@example.com"
    },
    "type": "custom-product",
    "timestamp": "2026-01-15T10:30:00.000Z"
  }
}
```

---

## 📤 1. Upload Single File

### Upload Dokumen PDF
```bash
curl -X POST http://localhost:3022/api/v1/upload/file \
  -F "file=@/Users/user/Desktop/document.pdf"
```

### Upload Gambar JPG
```bash
curl -X POST http://localhost:3022/api/v1/upload/file \
  -F "file=@/Users/user/Desktop/photo.jpg"
```

### Upload File Excel
```bash
curl -X POST http://localhost:3022/api/v1/upload/file \
  -F "file=@/Users/user/Documents/data.xlsx"
```

### Upload File Word
```bash
curl -X POST http://localhost:3022/api/v1/upload/file \
  -F "file=@/Users/user/Documents/report.docx"
```

### Upload Video MP4
```bash
curl -X POST http://localhost:3022/api/v1/upload/file \
  -F "file=@/Users/user/Videos/demo.mp4"
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "url": "/uploads/1733537269000-document.pdf",
    "downloadUrl": "http://localhost:3022/uploads/1733537269000-document.pdf",
    "filename": "1733537269000-document.pdf",
    "originalname": "document.pdf",
    "mimetype": "application/pdf",
    "size": 1048576,
    "extension": ".pdf",
    "uploadedAt": "2024-12-07T00:27:49.000Z"
  }
}
```

---

## 📤📤 2. Upload Multiple Files

```bash
curl -X POST http://localhost:3022/api/v1/upload/files \
  -F "files=@/Users/user/Desktop/document.pdf" \
  -F "files=@/Users/user/Desktop/photo.jpg" \
  -F "files=@/Users/user/Desktop/spreadsheet.xlsx"
```

**Response:**
```json
{
  "status": "success",
  "message": "Successfully uploaded 3 file(s)",
  "data": {
    "files": [
      {
        "url": "/uploads/1733537269000-document.pdf",
        "downloadUrl": "http://localhost:3022/uploads/1733537269000-document.pdf",
        "filename": "1733537269000-document.pdf",
        "originalname": "document.pdf",
        "mimetype": "application/pdf",
        "size": 1048576,
        "extension": ".pdf",
        "uploadedAt": "2024-12-07T00:27:49.000Z"
      },
      {
        "url": "/uploads/1733537270000-photo.jpg",
        "downloadUrl": "http://localhost:3022/uploads/1733537270000-photo.jpg",
        "filename": "1733537270000-photo.jpg",
        "originalname": "photo.jpg",
        "mimetype": "image/jpeg",
        "size": 524288,
        "extension": ".jpg",
        "uploadedAt": "2024-12-07T00:27:50.000Z"
      },
      {
        "url": "/uploads/1733537271000-spreadsheet.xlsx",
        "downloadUrl": "http://localhost:3022/uploads/1733537271000-spreadsheet.xlsx",
        "filename": "1733537271000-spreadsheet.xlsx",
        "originalname": "spreadsheet.xlsx",
        "mimetype": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "size": 2097152,
        "extension": ".xlsx",
        "uploadedAt": "2024-12-07T00:27:51.000Z"
      }
    ],
    "totalFiles": 3,
    "totalSize": 3670016
  }
}
```

---

## 🖼️ 3. Upload Image (Endpoint Khusus)

```bash
curl -X POST http://localhost:3022/api/v1/upload/image \
  -F "image=@/Users/user/Desktop/photo.jpg"
```

**Response:**
```json
{
  "status": "success",
  "url": "/uploads/1733537269000-photo.jpg",
  "downloadUrl": "http://localhost:3022/uploads/1733537269000-photo.jpg",
  "filename": "1733537269000-photo.jpg"
}
```

---

## 📋 4. Get File Info

```bash
curl http://localhost:3022/api/v1/upload/info/1733537269000-document.pdf
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "filename": "1733537269000-document.pdf",
    "url": "/uploads/1733537269000-document.pdf",
    "downloadUrl": "http://localhost:3022/uploads/1733537269000-document.pdf",
    "size": 1048576,
    "extension": ".pdf",
    "lastModified": "2024-12-07T00:27:49.000Z",
    "created": "2024-12-07T00:27:49.000Z"
  }
}
```

---

## ⬇️ 5. Download File

### Download langsung
```bash
curl -O http://localhost:3022/uploads/1733537269000-document.pdf
```

### Download dengan custom nama
```bash
curl -o my-document.pdf http://localhost:3022/uploads/1733537269000-document.pdf
```

### Check apakah file exists (HEAD request)
```bash
curl -I http://localhost:3022/uploads/1733537269000-document.pdf
```

---

## 🎯 Contoh Praktis

### Upload dan Simpan Response
```bash
curl -X POST http://localhost:3022/api/v1/upload/file \
  -F "file=@/Users/user/Desktop/document.pdf" \
  -o response.json

cat response.json
```

### Upload dengan Progress Bar
```bash
curl -X POST http://localhost:3022/api/v1/upload/file \
  -F "file=@/Users/user/Desktop/large-file.pdf" \
  --progress-bar
```

### Upload dan Extract Download URL (macOS/Linux)
```bash
# Upload file dan extract downloadUrl
DOWNLOAD_URL=$(curl -s -X POST http://localhost:3022/api/v1/upload/file \
  -F "file=@/Users/user/Desktop/document.pdf" \
  | grep -o '"downloadUrl":"[^"]*' | cut -d'"' -f4)

echo "Download URL: $DOWNLOAD_URL"

# Langsung download file tersebut
curl -O "$DOWNLOAD_URL"
```

### Upload Multiple Files dengan Loop
```bash
# Upload semua PDF di folder tertentu
for file in /Users/user/Documents/*.pdf; do
  echo "Uploading: $file"
  curl -X POST http://localhost:3022/api/v1/upload/file \
    -F "file=@$file" \
    | grep -o '"downloadUrl":"[^"]*' | cut -d'"' -f4
done
```

### Format JSON Response (Pretty Print)
```bash
# Dengan Python
curl -X POST http://localhost:3022/api/v1/upload/file \
  -F "file=@/Users/user/Desktop/document.pdf" \
  | python3 -m json.tool

# Dengan jq (jika terinstall)
curl -X POST http://localhost:3022/api/v1/upload/file \
  -F "file=@/Users/user/Desktop/document.pdf" \
  | jq '.'
```

---

## 🧪 Test Script Lengkap

Buat file `test-upload-simple.sh`:

```bash
#!/bin/bash

echo "🚀 Testing Upload API (No Auth Required!)"
echo "========================================"

# Test 1: Upload single file
echo ""
echo "📤 Test 1: Upload single file..."
RESPONSE=$(curl -s -X POST http://localhost:3022/api/v1/upload/file \
  -F "file=@/Users/user/Desktop/test.pdf")

echo "$RESPONSE" | python3 -m json.tool

# Extract download URL
DOWNLOAD_URL=$(echo $RESPONSE | grep -o '"downloadUrl":"[^"]*' | cut -d'"' -f4)
echo ""
echo "✅ Download URL: $DOWNLOAD_URL"

# Test 2: Verify file exists
echo ""
echo "🔍 Test 2: Verify file exists..."
STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$DOWNLOAD_URL")

if [ "$STATUS" = "200" ]; then
  echo "✅ File accessible! (HTTP $STATUS)"
else
  echo "❌ File not accessible (HTTP $STATUS)"
fi

# Test 3: Get file info
FILENAME=$(echo $RESPONSE | grep -o '"filename":"[^"]*' | cut -d'"' -f4)
echo ""
echo "📋 Test 3: Get file info for: $FILENAME"
curl -s http://localhost:3022/api/v1/upload/info/$FILENAME | python3 -m json.tool

echo ""
echo "✅ All tests completed!"
```

Jalankan:
```bash
chmod +x test-upload-simple.sh
./test-upload-simple.sh
```

---

## 📝 Supported File Types

✅ **Images:** JPG, JPEG, PNG, GIF, WEBP, SVG  
✅ **Documents:** PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, TXT, CSV  
✅ **Archives:** ZIP, RAR, 7Z  
✅ **Media:** MP4, AVI, MOV, MP3, WAV  

**Limits:**
- Max file size: **50MB**
- Max files per request: **10 files** (untuk multiple upload)

---

## ⚠️ Important Notes

1. **No Authentication Required** - Semua endpoint bisa diakses tanpa token
2. **Public Access** - Semua file yang diupload bisa didownload oleh siapa saja
3. **File Storage** - File disimpan di `src/public/uploads/`
4. **Auto Rename** - File otomatis direname dengan format: `{timestamp}-{sanitized-name}.{ext}`
5. **Validation** - File type dan size divalidasi di server side

---

## 🆘 Troubleshooting

### Error: "File type not allowed"
File type tidak didukung. Pastikan file Anda termasuk dalam daftar supported file types.

### Error: "File too large"
File melebihi 50MB. Compress atau split file Anda.

### Error: "No file uploaded"
Pastikan parameter field name benar:
- Single file: gunakan `file`
- Multiple files: gunakan `files`
- Image endpoint: gunakan `image`

### File tidak bisa didownload (404)
Pastikan:
1. Server sedang running
2. URL download benar (copy dari response)
3. File belum dihapus dari server
