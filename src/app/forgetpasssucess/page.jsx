"use client";

//react
import Link from "next/link";

import Image from "next/image";

//

import { GiDiamonds } from "react-icons/gi";


export default function ForgetPassSuccess() {
  return (
    <>
      <div className="flex items-center justify-center min-h-screen   bg-cyan-500">
        <div className="flex flex-col items-center justify-center w-3/4 gap-2 py-6 bg-white rounded-2xl sm:w-2/4">
          <Image
            src="/images/forgetPasswordSuccesfull.png"
            alt="sample"
            width={300}
            height={150}
          />
          <div className="flex gap-1 text-3xl font-semibold">
            <GiDiamonds className="mt-1" />
            <h1 className="text-center">
              Sucessfully reset <br />
              your password
            </h1>
          </div>

          <div className="relative text-center">
            <div className="absolute flex items-center inset-2">
              <div className="w-full border-t border-gray-400" />
            </div>
            <div className="relative inline-block px-4 text-sm bg-white">
              <span className="font-light">
                Back to{" "}
                <Link href="/tenantlogin" className="text-cyan-500">
                  {" "}
                  Login
                </Link>
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
