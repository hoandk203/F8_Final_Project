import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Hàm kiểm tra email trong database (cho /verify-driver)
async function checkEmailMiddleware(req: NextRequest) {
    console.log("checkEmailMiddleware");

    // Lấy token từ cookies
    const token = req.cookies.get("access_token")?.value;
    if (!token) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/check-email`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        const data = await res.json();
        const response = NextResponse.next();

        if (data.exists) {
            response.cookies.set("verifyDriverStep", "1");
        } else {
            response.cookies.set("verifyDriverStep", "0");
        }

        return response;
    } catch (error) {
        console.error("Middleware Error:", error);
        return NextResponse.next();
    }
}

// Middleware chính để điều hướng từng trang
export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;
    console.log("Middleware triggered:", pathname);

    if (pathname.startsWith("/driver/verify-driver")) {
        return checkEmailMiddleware(req);
    }

    return NextResponse.next();
}

// Xác định middleware áp dụng cho các đường dẫn nào
export const config = {
    matcher: ["/driver/verify-driver"],
};
