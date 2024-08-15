// import Link from './Link'
// import siteMetadata from '@/data/siteMetadata'
// import SocialIcon from '@/components/social-icons'
import Image from 'next/image'

export default function Footer() {
  return (
    // TODO: Footer
    <footer className="font-barlow-semi-condensed">
      {/* Full-width section with bg-[#222222] */}
      <div>
        {/* background */}
        <div className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] h-[334px] w-screen max-w-none bg-[#222222] bg-cover bg-center">
          {/* Overlay on top */}
          <div className="mx-auto w-[1300px] max-w-[90%]">
            <div className="flex justify-between space-x-20 text-[#c6d3d6]">
              <Image
                src="/static/images/design/Group 5.svg"
                alt="Black Logo"
                width={200} // Fixed width
                height={0} // This will allow the height to auto-adjust based on aspect ratio
                style={{
                  height: 'auto', // Maintain aspect ratio
                  opacity: 1,
                }}
                className="mt-16"
              />
              {/* 
              TODO: MAKE THIS ROW RESPONSIVE
              TODO: FIX LOCATION OF ELEMENTS
              
              */}
              <div className=" mt-16 w-full">
                <h1 className="font-space-grotesk text-[16px] font-bold">
                  ADDRESS
                </h1>
                <p>Litecoin Foundation Ltd.</p>
                <p>111 North Bridge Rd</p>
                <p>#08-11 Peninsula Plaza</p>
                <p>Singapore 179098</p>
              </div>
              <div className=" mt-16 w-full">
                <h1 className="font-space-grotesk text-[16px] font-bold">
                  CONTACT
                </h1>
                <p>contact@litecoin.net</p>
              </div>
              <div className=" mt-16 w-full">
                <h1 className="font-space-grotesk text-[16px] font-bold">
                  SOCIAL
                </h1>
                <p>twitter</p>
                <p>reddit</p>
                <p>facebook</p>
                <p>github</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Full-width section with bg-black */}
      <div className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] flex h-[52px] w-screen max-w-none items-center bg-black bg-cover bg-center">
        {/* TODO: Link privacy and terms */}
        <div
          className="mx-auto w-[1300px] max-w-[90%] text-left text-[13px] text-[#767e7f]"
          style={{
            fontFamily:
              'system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif',
          }}
        >
          Copyright © 2024 Litecoin Foundation. | Privacy Policy | Terms &
          Conditions
          <br />
        </div>
      </div>
    </footer>
  )
}
