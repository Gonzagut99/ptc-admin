/**
 * Cloudflare R2 Upload Service
 * 
 * Este servicio permite subir archivos a Cloudflare R2 usando la API S3 compatible.
 * Para un demo, la subida se hace directamente desde el frontend.
 * 
 * IMPORTANTE: En producción, las credenciales deberían manejarse desde el backend.
 */

// Tipos para el servicio
export interface R2UploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

export interface R2Config {
  accountId: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucketName: string;
}

// Obtener configuración desde variables de entorno
function getR2Config(): R2Config {
  const accountId = process.env.NEXT_PUBLIC_R2_ACCOUNT_ID;
  const accessKeyId = process.env.NEXT_PUBLIC_R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.NEXT_PUBLIC_R2_SECRET_ACCESS_KEY;
  const bucketName = process.env.NEXT_PUBLIC_R2_BUCKET_NAME || "ptcdemo-bucket";

  if (!accountId || !accessKeyId || !secretAccessKey) {
    throw new Error(
      "Faltan variables de entorno para R2: NEXT_PUBLIC_R2_ACCOUNT_ID, NEXT_PUBLIC_R2_ACCESS_KEY_ID, NEXT_PUBLIC_R2_SECRET_ACCESS_KEY"
    );
  }

  return { accountId, accessKeyId, secretAccessKey, bucketName };
}

/**
 * Genera una firma HMAC-SHA256 para la autenticación AWS Signature Version 4
 */
async function hmacSHA256(key: ArrayBuffer | string, data: string): Promise<ArrayBuffer> {
  const encoder = new TextEncoder();
  const keyData = typeof key === "string" ? encoder.encode(key) : key;
  
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  
  return crypto.subtle.sign("HMAC", cryptoKey, encoder.encode(data));
}

/**
 * Calcula el hash SHA-256 de los datos
 */
async function sha256(data: string | ArrayBuffer): Promise<string> {
  const encoder = new TextEncoder();
  const dataBuffer = typeof data === "string" ? encoder.encode(data) : data;
  const hashBuffer = await crypto.subtle.digest("SHA-256", dataBuffer);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * Convierte ArrayBuffer a string hexadecimal
 */
function arrayBufferToHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * Genera la clave de firma para AWS Signature Version 4
 */
async function getSignatureKey(
  secretKey: string,
  dateStamp: string,
  region: string,
  service: string
): Promise<ArrayBuffer> {
  const kDate = await hmacSHA256(`AWS4${secretKey}`, dateStamp);
  const kRegion = await hmacSHA256(kDate, region);
  const kService = await hmacSHA256(kRegion, service);
  return hmacSHA256(kService, "aws4_request");
}

/**
 * Genera un nombre de archivo único con timestamp y UUID parcial
 */
function generateUniqueFileName(originalName: string): string {
  const timestamp = Date.now();
  const randomId = crypto.randomUUID().split("-")[0];
  const extension = originalName.split(".").pop() || "file";
  const baseName = originalName.replace(/\.[^/.]+$/, "").replace(/[^a-zA-Z0-9]/g, "_");
  return `payments/${timestamp}_${randomId}_${baseName}.${extension}`;
}

/**
 * Sube un archivo a Cloudflare R2
 */
export async function uploadToR2(file: File): Promise<R2UploadResult> {
  try {
    const config = getR2Config();
    const fileName = generateUniqueFileName(file.name);
    
    // Configuración de R2/S3
    const region = "auto";
    const service = "s3";
    const host = `${config.accountId}.r2.cloudflarestorage.com`;
    const endpoint = `https://${host}/${config.bucketName}/${fileName}`;
    
    // Fecha y hora para la firma
    const now = new Date();
    const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, "");
    const dateStamp = amzDate.slice(0, 8);
    
    // Leer el contenido del archivo
    const fileBuffer = await file.arrayBuffer();
    const payloadHash = await sha256(fileBuffer);
    
    // Headers canónicos
    const headers: Record<string, string> = {
      host: host,
      "x-amz-content-sha256": payloadHash,
      "x-amz-date": amzDate,
      "content-type": file.type || "application/octet-stream",
    };
    
    // Crear string de headers canónicos
    const signedHeaders = Object.keys(headers).sort().join(";");
    const canonicalHeaders = Object.keys(headers)
      .sort()
      .map((key) => `${key}:${headers[key]}\n`)
      .join("");
    
    // Crear request canónico
    const canonicalUri = `/${config.bucketName}/${fileName}`;
    const canonicalQuerystring = "";
    const canonicalRequest = [
      "PUT",
      canonicalUri,
      canonicalQuerystring,
      canonicalHeaders,
      signedHeaders,
      payloadHash,
    ].join("\n");
    
    // Crear string para firmar
    const algorithm = "AWS4-HMAC-SHA256";
    const credentialScope = `${dateStamp}/${region}/${service}/aws4_request`;
    const canonicalRequestHash = await sha256(canonicalRequest);
    const stringToSign = [
      algorithm,
      amzDate,
      credentialScope,
      canonicalRequestHash,
    ].join("\n");
    
    // Calcular la firma
    const signingKey = await getSignatureKey(
      config.secretAccessKey,
      dateStamp,
      region,
      service
    );
    const signature = arrayBufferToHex(await hmacSHA256(signingKey, stringToSign));
    
    // Crear header de autorización
    const authorization = `${algorithm} Credential=${config.accessKeyId}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;
    
    // Hacer la petición PUT a R2
    const response = await fetch(endpoint, {
      method: "PUT",
      headers: {
        ...headers,
        Authorization: authorization,
      },
      body: fileBuffer,
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("R2 Upload Error:", errorText);
      return {
        success: false,
        error: `Error al subir archivo: ${response.status} ${response.statusText}`,
      };
    }
    
    // Construir URL pública (si el bucket tiene acceso público configurado)
    // Si no, necesitarás configurar un dominio personalizado o usar URLs firmadas
    const publicUrl = `https://pub-${config.accountId}.r2.dev/${config.bucketName}/${fileName}`;
    
    // Alternativamente, puedes usar la URL del endpoint S3
    const s3Url = endpoint;
    
    return {
      success: true,
      url: s3Url, // Usamos la URL S3, ajustar según la configuración de tu bucket
    };
  } catch (error) {
    console.error("Error uploading to R2:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error desconocido al subir archivo",
    };
  }
}

/**
 * Valida el tipo y tamaño del archivo antes de subir
 */
export function validateFile(
  file: File,
  options: {
    maxSizeMB?: number;
    allowedTypes?: string[];
  } = {}
): { valid: boolean; error?: string } {
  const { maxSizeMB = 10, allowedTypes = ["image/jpeg", "image/png", "image/webp", "application/pdf"] } = options;
  
  // Validar tamaño
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    return {
      valid: false,
      error: `El archivo excede el tamaño máximo de ${maxSizeMB}MB`,
    };
  }
  
  // Validar tipo
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `Tipo de archivo no permitido. Tipos aceptados: ${allowedTypes.join(", ")}`,
    };
  }
  
  return { valid: true };
}
