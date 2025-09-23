// Image Download Script for Dr. Abram Ernest Website
// Run this in browser console on original abramernest.com website

(function() {
    'use strict';

    console.log('🔍 Scanning for images on abramernest.com...');

    // Find all images on the page
    const images = document.querySelectorAll('img');
    const imageData = [];

    images.forEach((img, index) => {
        if (img.src && !img.src.includes('data:')) {
            const imageInfo = {
                index: index + 1,
                src: img.src,
                alt: img.alt || 'No alt text',
                width: img.naturalWidth || img.width,
                height: img.naturalHeight || img.height,
                className: img.className,
                id: img.id
            };

            imageData.push(imageInfo);

            // Log image info
            console.log(`📸 Image ${index + 1}:`, {
                URL: img.src,
                Alt: img.alt,
                Size: `${imageInfo.width}x${imageInfo.height}`,
                Class: img.className,
                ID: img.id
            });
        }
    });

    // Create download function
    function downloadImage(url, filename) {
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    // Auto-categorize and download images
    function categorizeAndDownload() {
        imageData.forEach((img, index) => {
            let filename = '';
            const url = new URL(img.src);
            const originalName = url.pathname.split('/').pop();
            const extension = originalName.split('.').pop();

            // Smart filename generation based on context
            if (img.alt.toLowerCase().includes('doctor') ||
                img.alt.toLowerCase().includes('dr') ||
                img.className.includes('doctor') ||
                img.id.includes('doctor')) {
                filename = `doctor-profile.${extension}`;
            } else if (img.alt.toLowerCase().includes('clinic') ||
                      img.alt.toLowerCase().includes('hospital') ||
                      img.className.includes('clinic')) {
                filename = `clinic-interior.${extension}`;
            } else if (img.alt.toLowerCase().includes('logo')) {
                filename = `logo.${extension}`;
            } else if (img.alt.toLowerCase().includes('surgery') ||
                      img.alt.toLowerCase().includes('operation')) {
                filename = `surgery-procedure.${extension}`;
            } else if (img.alt.toLowerCase().includes('equipment')) {
                filename = `equipment.${extension}`;
            } else {
                filename = `image-${index + 1}.${extension}`;
            }

            // Download with delay to avoid rate limiting
            setTimeout(() => {
                downloadImage(img.src, filename);
                console.log(`⬇️ Downloaded: ${filename}`);
            }, index * 1000);
        });
    }

    // Display results
    console.log(`\n📊 Found ${imageData.length} images total`);
    console.log('\n🎯 Recommended images to download:');

    // Create download buttons in page
    const downloadPanel = document.createElement('div');
    downloadPanel.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        width: 300px;
        background: white;
        border: 2px solid #007bff;
        border-radius: 10px;
        padding: 20px;
        z-index: 10000;
        box-shadow: 0 5px 20px rgba(0,0,0,0.3);
        font-family: Arial, sans-serif;
    `;

    downloadPanel.innerHTML = `
        <h3 style="margin: 0 0 15px 0; color: #007bff;">Image Downloader</h3>
        <p style="margin: 0 0 15px 0; font-size: 14px;">Found ${imageData.length} images</p>
        <button id="downloadAll" style="
            background: #007bff;
            color: white;
            border: none;
            padding: 10px 15px;
            border-radius: 5px;
            cursor: pointer;
            width: 100%;
            margin-bottom: 10px;
        ">Download All Images</button>
        <button id="closePanel" style="
            background: #dc3545;
            color: white;
            border: none;
            padding: 5px 10px;
            border-radius: 5px;
            cursor: pointer;
            width: 100%;
        ">Close</button>
    `;

    document.body.appendChild(downloadPanel);

    // Add event listeners
    document.getElementById('downloadAll').onclick = categorizeAndDownload;
    document.getElementById('closePanel').onclick = () => downloadPanel.remove();

    // Generate wget commands for manual download
    console.log('\n🖥️ Or use these wget commands:');
    imageData.forEach((img, index) => {
        console.log(`wget "${img.src}" -O "images/image-${index + 1}.jpg"`);
    });

    // Generate curl commands
    console.log('\n🌐 Or use these curl commands:');
    imageData.forEach((img, index) => {
        console.log(`curl "${img.src}" -o "images/image-${index + 1}.jpg"`);
    });

    return imageData;
})();