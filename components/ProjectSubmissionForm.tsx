import { useRouter } from 'next/router'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { fetchPostJSON } from '../utils/api-helpers'
import FormButton from '@/components/FormButton'

export default function ProjectSubmissionForm() {
  const [loading, setLoading] = useState(false)
  const [openSource, setOpenSource] = useState('null')
  const [receivedFunding, setReceivedFunding] = useState('null')
  const [isLeadContributor, setIsLeadContributor] = useState('null')
  const router = useRouter()
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isValid },
  } = useForm()

  const [failureReason, setFailureReason] = useState<string>()

  const onSubmit = async (data: any) => {
    setLoading(true)

    const structuredData = {
      project_overview: {
        project_name: data.project_name,
        project_description: data.project_description,
        main_focus: data.main_focus,
        potential_impact: data.potential_impact,
        project_repository: data.project_repository,
        social_media_links: data.social_media_links,
        open_source: openSource, // Send the openSource state directly
        open_source_license: data.open_source_license, // Include license
        partially_open_source: data.partially_open_source, // Include explanation
      },
      project_budget: {
        proposed_budget: data.proposed_budget,
        received_funding: receivedFunding === 'yes',
        prior_funding_details: data.prior_funding_details,
      },
      applicant_information: {
        your_name: data.your_name,
        email: data.email,
        is_lead_contributor: isLeadContributor === 'yes',
        other_lead: data.other_lead,
        personal_github: data.personal_github,
        other_contact_details: data.other_contact_details,
        prior_contributions: data.prior_contributions,
        references: data.references,
      },
    }

    try {
      const res = await fetchPostJSON('/api/github', structuredData)
      if (res.message === 'success') {
        router.push('/projects-new/submitted')
        setLoading(false)
      } else {
        setFailureReason('Submission failed. Please try again.')
      }
    } catch (e) {
      if (e instanceof Error) {
        setFailureReason(`Error: ${e.message}`)
        console.error('Error submitting project:', e.message)
      } else {
        setFailureReason('An unknown error occurred.')
      }
      setLoading(false)
    }
  }

  const buttonVariant = isValid && isDirty ? 'enabled' : 'disabled'

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex max-w-2xl flex-col gap-4"
    >
      <input type="hidden" {...register('project', { value: true })} />

      <h2 className="text-xl font-semibold">Project Overview</h2>

      <label className="block" htmlFor="project_name">
        Project Name <span className="text-red-500">*</span>
        <input
          id="project_name"
          type="text"
          className="mt-1 block w-full rounded-none border-gray-300 text-black shadow-sm focus:border-[#C5D3D6] focus:ring focus:ring-[#C5D3D6] focus:ring-opacity-50"
          {...register('project_name', { required: true })}
        />
      </label>

      <label className="block">
        Project Description <span className="text-red-500">*</span>
        <textarea
          className="mt-1 block h-40 w-full rounded-none border-gray-300 text-black shadow-sm focus:border-[#C5D3D6] focus:ring focus:ring-[#C5D3D6] focus:ring-opacity-50"
          {...register('project_description', { required: true })}
        />
      </label>

      <label className="block">
        Main Focus <span className="text-red-500">*</span>
        <select
          className="mt-1 block w-full rounded-none border-gray-300 text-black shadow-sm focus:border-[#C5D3D6] focus:ring focus:ring-[#C5D3D6] focus:ring-opacity-50"
          {...register('main_focus', { required: true })}
        >
          <option value="litecoin">Litecoin Core</option>
          <option value="meta">Meta Protocols (Eg. Ordinals/Omni)</option>
          <option value="ordinals">Ordinals Lite</option>
          <option value="omni">Omni Layer</option>
          <option value="tools">Tooling(Eg. LDK/LTCSuite)</option>
          <option value="ldk">Litecoin Dev Kit (Rust)</option>
          <option value="ltcsuite">LTC Suite (Go)</option>
          <option value="lightning">Lightning Network</option>
          <option value="atomicswaps">Atomic Swaps</option>
          <option value="education">Education/Guides</option>
          <option value="wallet">Wallets</option>
          <option value="other">Other</option>
        </select>
      </label>

      <label className="block">
        Potential Impact <span className="text-red-500">*</span>
        <textarea
          className="mt-1 block h-40 w-full rounded-none border-gray-300 text-black shadow-sm focus:border-[#C5D3D6] focus:ring focus:ring-[#C5D3D6] focus:ring-opacity-50"
          {...register('potential_impact', { required: true })}
        />
      </label>

      <label className="block">
        Project Repository
        <input
          type="text"
          className="mt-1 block w-full rounded-none border-gray-300 text-black shadow-sm focus:border-[#C5D3D6] focus:ring focus:ring-[#C5D3D6] focus:ring-opacity-50"
          {...register('project_repository')}
        />
      </label>

      <label className="block">
        Social Media Links (X, GitHub, LinkedIn, Facebook, Telegram){' '}
        <span className="text-red-500">*</span>
        <textarea
          className="mt-1 block w-full rounded-none border-gray-300 text-black shadow-sm focus:border-[#C5D3D6] focus:ring focus:ring-[#C5D3D6] focus:ring-opacity-50"
          {...register('social_media_links', { required: true })}
        />
      </label>

      <p className="mb-2">
        Is your project open-source? <span className="text-red-500">*</span>
      </p>
      <div className="w-full">
        <div className="flex w-full space-x-4 border border-gray-300 bg-gray-100 p-1">
          <button
            type="button"
            className={`flex-grow rounded-lg px-4 py-2 shadow ${
              openSource === 'yes'
                ? 'bg-[#C5D3D6] text-[#222222] shadow-md'
                : 'bg-white text-[#222222] shadow-md'
            }`}
            onClick={() => setOpenSource('yes')}
          >
            Yes
          </button>
          <button
            type="button"
            className={`flex-grow rounded-lg px-4 py-2 shadow ${
              openSource === 'no'
                ? 'bg-gray-300 text-[#222222] shadow-md'
                : 'bg-white text-[#222222] shadow-md'
            }`}
            onClick={() => setOpenSource('no')}
          >
            No
          </button>
          <button
            type="button"
            className={`flex-grow rounded-lg px-4 py-2 shadow ${
              openSource === 'partially'
                ? 'bg-[#C5D3D6] text-[#222222] shadow-md'
                : 'bg-white text-[#222222] shadow-md'
            }`}
            onClick={() => setOpenSource('partially')}
          >
            Partially
          </button>
        </div>
        <div className="ml-4 mt-4 text-sm">
          {openSource === 'null' && (
            <div className="opacity-100 transition-opacity duration-300">
              Select Yes, No, or Partially.
            </div>
          )}
          {openSource === 'yes' && (
            <div className="opacity-100 transition-opacity duration-300">
              <label className="block">
                Please provide the open-source license used (e.g., MIT, GPL,
                Apache 2.0).
                <input
                  type="text"
                  className="mt-1 block w-full rounded-none border-gray-300 text-black shadow-sm focus:border-[#C5D3D6] focus:ring focus:ring-[#C5D3D6] focus:ring-opacity-50"
                  {...register('open_source_license')}
                />
              </label>
            </div>
          )}
          {openSource === 'no' && (
            <div className="opacity-100 transition-opacity duration-300">
              This project is not open-source.
            </div>
          )}
          {openSource === 'partially' && (
            <div className="opacity-100 transition-opacity duration-300">
              <label className="block">
                Please briefly explain which parts of your project are
                open-source and which are not. Also, provide the open-source
                license used for the open-source parts.
                <textarea
                  className="mt-1 block w-full rounded-none border-gray-300 text-black shadow-sm focus:border-[#C5D3D6] focus:ring focus:ring-[#C5D3D6] focus:ring-opacity-50"
                  {...register('partially_open_source')}
                />
              </label>
            </div>
          )}
        </div>
      </div>

      <h2 className="text-xl font-semibold">Project Budget</h2>

      <label className="block">
        Proposed Budget <span className="text-red-500">*</span>
        <textarea
          className="mt-1 block w-full rounded-none border-gray-300 text-black shadow-sm focus:border-[#C5D3D6] focus:ring focus:ring-[#C5D3D6] focus:ring-opacity-50"
          {...register('proposed_budget', { required: true })}
        />
      </label>

      <p className="">Has this project received any prior funding?</p>
      <div className="w-full">
        <div className="flex w-full space-x-4 border border-gray-300 bg-gray-100  p-1">
          <button
            type="button"
            className={`flex-grow rounded-lg px-4 py-2 shadow ${
              receivedFunding === 'yes'
                ? 'bg-[#C5D3D6] text-[#222222] shadow-md'
                : 'bg-white text-[#222222] shadow-md'
            }`}
            onClick={() => setReceivedFunding('yes')}
          >
            Yes
          </button>
          <button
            type="button"
            className={`flex-grow rounded-lg px-4 py-2 shadow ${
              receivedFunding === 'no'
                ? 'bg-gray-300 text-[#222222] shadow-md'
                : 'bg-white text-[#222222] shadow-md'
            }`}
            onClick={() => setReceivedFunding('no')}
          >
            No
          </button>
        </div>
        <div className="ml-4 mt-4 text-sm">
          {receivedFunding === 'null' && (
            <div className="opacity-100 transition-opacity duration-300">
              Select Yes or No
            </div>
          )}
          {receivedFunding === 'yes' && (
            <div>
              <div className="opacity-100 transition-opacity duration-300">
                This project has received prior funding. Please describe:
              </div>
              <label className="block">
                <input
                  type="text"
                  className="mt-1 block w-full rounded-none border-gray-300 text-black shadow-sm focus:border-[#C5D3D6] focus:ring focus:ring-[#C5D3D6] focus:ring-opacity-50"
                  {...register('prior_funding_details')}
                />
              </label>
            </div>
          )}
          {receivedFunding === 'no' && (
            <div className="opacity-100 transition-opacity duration-300">
              This project has not received prior funding.
            </div>
          )}
        </div>
      </div>

      <h2 className="text-xl font-semibold">Applicant Information</h2>

      <label className="block">
        Your Name <span className="text-red-500">*</span>
        <input
          type="text"
          className="mt-1 block w-full rounded-none border-gray-300 text-black shadow-sm focus:border-[#C5D3D6] focus:ring focus:ring-[#C5D3D6] focus:ring-opacity-50"
          {...register('your_name', { required: true })}
        />
      </label>

      <label className="block">
        Email <span className="text-red-500">*</span>
        <input
          type="email"
          className="mt-1 block w-full rounded-none border-gray-300 text-black shadow-sm focus:border-[#C5D3D6] focus:ring focus:ring-[#C5D3D6] focus:ring-opacity-50"
          {...register('email', { required: true })}
        />
      </label>

      <p className="">Are you the Project Lead / Lead Contributor?</p>
      <div className="w-full">
        <div className="flex w-full space-x-4 border border-gray-300 bg-gray-100  p-1">
          <button
            type="button"
            className={`flex-grow rounded-lg px-4 py-2 shadow ${
              isLeadContributor === 'yes'
                ? 'bg-[#C5D3D6] text-[#222222] shadow-md'
                : 'bg-white text-[#222222] shadow-md'
            }`}
            onClick={() => setIsLeadContributor('yes')}
          >
            Yes
          </button>
          <button
            type="button"
            className={`flex-grow rounded-lg px-4 py-2 shadow ${
              isLeadContributor === 'no'
                ? 'bg-gray-300 text-[#222222] shadow-md'
                : 'bg-white text-[#222222] shadow-md'
            }`}
            onClick={() => setIsLeadContributor('no')}
          >
            No
          </button>
        </div>
        <div className="ml-4 mt-4 text-sm">
          {isLeadContributor === 'null' && (
            <div className="opacity-100 transition-opacity duration-300">
              Select Yes or No
            </div>
          )}
          {isLeadContributor === 'yes' && (
            <div className="opacity-100 transition-opacity duration-300">
              I am the lead contributor.
            </div>
          )}
          {isLeadContributor === 'no' && (
            <div>
              <label className="block">
                Who is the project lead?
                <input
                  type="text"
                  className="mt-1 block w-full rounded-none border-gray-300 text-black shadow-sm focus:border-[#C5D3D6] focus:ring focus:ring-[#C5D3D6] focus:ring-opacity-50"
                  {...register('other_lead')}
                />
              </label>
            </div>
          )}
        </div>
      </div>

      <label className="block">
        Personal Github (or similar, if applicable)
        <input
          type="text"
          className="mt-1 block w-full rounded-none border-gray-300 text-black shadow-sm focus:border-[#C5D3D6] focus:ring focus:ring-[#C5D3D6] focus:ring-opacity-50"
          {...register('personal_github')}
        />
      </label>

      <label className="block">
        Other Contact Details
        <textarea
          className="mt-1 block w-full rounded-none border-gray-300 text-black shadow-sm focus:border-[#C5D3D6] focus:ring focus:ring-[#C5D3D6] focus:ring-opacity-50"
          {...register('other_contact_details')}
        />
      </label>

      <label className="block">
        Prior Contributions
        <textarea
          className="mt-1 block h-40 w-full rounded-none border-gray-300 text-black shadow-sm focus:border-[#C5D3D6] focus:ring focus:ring-[#C5D3D6] focus:ring-opacity-50"
          {...register('prior_contributions')}
        />
      </label>

      <label className="block">
        References <span className="text-red-500">*</span>
        <textarea
          className="mt-1 block w-full rounded-none border-gray-300 text-black shadow-sm focus:border-[#C5D3D6] focus:ring focus:ring-[#C5D3D6] focus:ring-opacity-50"
          {...register('references', { required: true })}
        />
      </label>

      <FormButton
        variant={
          buttonVariant === 'enabled' ? 'enabledSpecific' : buttonVariant
        }
        type="submit"
        disabled={loading}
      >
        Submit Project
      </FormButton>

      {!!failureReason && (
        <p className="rounded bg-red-500 p-4 text-white">
          Something went wrong! {failureReason}
        </p>
      )}
    </form>
  )
}
