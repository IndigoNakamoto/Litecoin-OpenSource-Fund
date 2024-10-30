import React from 'react'

function SectionMatchingDonations() {
  return (
    <div className="text-center">
      <h1 className="mb-4 font-space-grotesk text-4xl font-bold text-[#222222]">
        Double Your Impact with Charlie Lee’s Matching Donations!
      </h1>
      <p className="mb-6  text-lg text-[#333333]">
        In an exciting announcement at the Litecoin Summit in Nashville, Charlie
        Lee has pledged to match donations up to{' '}
        <strong>$250,000 annually</strong> for the next five years, totaling{' '}
        <strong>$1.25 million</strong>! This means your donation will have
        double the impact.
      </p>
      <div className="flex flex-col items-center justify-center gap-4 md:flex-row">
        <div className="flex-1">
          <h3 className="mb-2 font-space-grotesk text-2xl font-semibold text-[#222222]">
            Allocation of Funds:
          </h3>
          <ul className="list-inside list-disc  text-lg text-[#555555]">
            <li>
              <strong>$50,000</strong> dedicated to the projects and bounty
              program.
            </li>
            <li>
              <strong>$200,000</strong> for direct support of the Litecoin
              Foundation.
            </li>
          </ul>
        </div>
        <div className="flex-1">
          <h3 className="mb-2 font-space-grotesk text-2xl font-semibold text-[#222222]">
            Why It Matters:
          </h3>
          <p className="markdown text-lg text-[#555555]">
            "Because Litecoin was launched fairly, as you all know, we didn’t
            print money for ourselves. So because of that the Litecoin
            Foundation is very lean. Most projects that come to us we have to
            turn down because we don’t have the funding. I want to change that."
            - <em>Charlie Lee</em>
          </p>
        </div>
      </div>
      <p className="mt-4 text-sm text-[#777777]">
        *Charlie Lee will match your donations dollar for dollar up to the
        specified amounts each year.
      </p>
    </div>
  )
}

export default SectionMatchingDonations
