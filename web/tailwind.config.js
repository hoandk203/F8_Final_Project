/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{js,ts,jsx,tsx,mdx}',],
    safelist: [
        'bg-red-600',
        'hover:bg-red-700',
        'bg-yellow-50',
        'border-yellow-200',
        'text-yellow-700',
        'text-gray-600',
        'grid-cols-1',
        'font-semibold',
        'pt-4',
        'pb-4',
        'px-4',
        'gap-y-2',
        'py-2',
        'px-4',
        'rounded-lg',
        'text-white',
      ],
    theme: {
        extend: {},
        container: {
            screens: {
                sm: '640px',
                md: '768px',
                lg: '1024px',
                xl: '1280px',
                '2xl': '1536px',
            },
        },
    },
    plugins: [],
}

