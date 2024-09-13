import React, { useState, useEffect, useCallback } from "react";
import styles from './ImageInput.module.css';

const ImageInput = ({
  setImageBase64
}: {
  setImageBase64: React.Dispatch<React.SetStateAction<string | ArrayBuffer>>;
}) => {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    if (image) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
        setImageBase64(reader.result!);
      };
      reader.readAsDataURL(image);
    } else {
      setPreview(null);
    }
  }, [image, setImageBase64]);

  const handleFile = useCallback((file: File | null) => {
    if (file && file.type.startsWith('image/')) {
      setImage(file);
    } else {
      alert('Please select a valid image file.');
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    handleFile(file);
  };

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className={styles.container}>
      <div 
        className={`${styles.inputWrapper} ${dragActive ? styles.dragActive : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <label htmlFor="image" className={styles.label}>
          {preview ? (
            <img src={preview} alt="Preview" className={styles.preview} />
          ) : (
            <div className={styles.placeholder}>
              <svg
                className={styles.icon}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                ></path>
              </svg>
              <p className={styles.placeholderText}>
                <span className={styles.bold}>Click to upload</span> or drag and drop
              </p>
              <p className={styles.placeholderSubtext}>PNG, JPG, GIF up to 10MB</p>
            </div>
          )}
          <input
            name="image"
            className={styles.input}
            type="file"
            accept="image/*"
            id="image"
            onChange={handleChange}
          />
        </label>
      </div>
      {image && (
        <p className={styles.fileInfo}>
          File: {image.name} ({(image.size / 1024 / 1024).toFixed(2)} MB)
        </p>
      )}
    </div>
  );
};

export default ImageInput;