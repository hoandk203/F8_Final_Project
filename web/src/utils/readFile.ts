export const readFile = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string); // Ép kiểu về string
        reader.onerror = (error) => reject(error);
    });
};
