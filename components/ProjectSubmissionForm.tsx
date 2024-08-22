import { useRouter } from 'next/router'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { fetchPostJSON } from '../utils/api-helpers'
import FormButton from '@/components/FormButton'
import {
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
} from '@material-tailwind/react'

export default function ProjectSubmissionForm() {
  const [loading, setLoading] = useState(false)
  const [openSource, setOpenSource] = useState('no')
  const [receivedFunding, setReceivedFunding] = useState('no')
  const [isLeadContributor, setIsLeadContributor] = useState('no')
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
        open_source: openSource === 'yes',
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
        router.push('/projects/submitted')
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
          className="mt-1 block w-full rounded-none border-gray-300 text-black shadow-sm focus:border-[#C5D3D6] focus:ring focus:ring-[#C5D3D6] focus:ring-opacity-50"
          {...register('project_description', { required: true })}
        />
      </label>

      <label className="block">
        Main Focus <span className="text-red-500">*</span>
        <select
          className="mt-1 block w-full rounded-none border-gray-300 text-black shadow-sm focus:border-[#C5D3D6] focus:ring focus:ring-[#C5D3D6] focus:ring-opacity-50"
          {...register('main_focus', { required: true })}
        >
          <option value="litecoin">Litecoin</option>
          <option value="lightning">Lightning</option>
          <option value="mweb">MWEB</option>
          <option value="ordinals">Ordinals Lite</option>
          <option value="omnilite">Omni Lite</option>
          <option value="ldk">Litecoin Dev Kit</option>
          <option value="education">Education</option>
          <option value="litewallet">Litewallet</option>
          <option value="other">Other</option>
        </select>
      </label>

      <label className="block">
        Potential Impact <span className="text-red-500">*</span>
        <textarea
          className="mt-1 block w-full rounded-none border-gray-300 text-black shadow-sm focus:border-[#C5D3D6] focus:ring focus:ring-[#C5D3D6] focus:ring-opacity-50"
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
        Social Media Links (X, GitHub, LinkedIn, Facebook, Telegram)
        <textarea
          className="mt-1 block w-full rounded-none border-gray-300 text-black shadow-sm focus:border-[#C5D3D6] focus:ring focus:ring-[#C5D3D6] focus:ring-opacity-50"
          {...register('social_media_links')}
        />
      </label>

      <p className="">
        Is the project open-source? <span className="text-red-500">*</span>
      </p>
      <Tabs value={openSource}>
        <TabsHeader className="bg-gray-100">
          {['yes', 'no'].map((value) => (
            <Tab
              key={value}
              value={value}
              onClick={() => setOpenSource(value)}
              className="text-black"
            >
              {value === 'yes' ? 'Yes' : 'No'}
            </Tab>
          ))}
        </TabsHeader>
        <TabsBody>
          {['yes', 'no'].map((value) => (
            <TabPanel key={value} value={value} className="mt-2 text-black">
              {value === 'yes'
                ? 'The project is open-source and available to the community.'
                : 'The project is not open-source.'}
            </TabPanel>
          ))}
        </TabsBody>
      </Tabs>

      <h2 className="text-xl font-semibold">Project Budget</h2>

      <label className="block">
        Proposed Budget <span className="text-red-500">*</span>
        <textarea
          className="mt-1 block w-full rounded-none border-gray-300 text-black shadow-sm focus:border-[#C5D3D6] focus:ring focus:ring-[#C5D3D6] focus:ring-opacity-50"
          {...register('proposed_budget', { required: true })}
        />
      </label>

      <p className="">Has this project received any prior funding?</p>
      <Tabs value={receivedFunding}>
        <TabsHeader className="bg-gray-100">
          {['yes', 'no'].map((value) => (
            <Tab
              key={value}
              value={value}
              onClick={() => setReceivedFunding(value)}
              className="text-black"
            >
              {value === 'yes' ? 'Yes' : 'No'}
            </Tab>
          ))}
        </TabsHeader>
        <TabsBody>
          {['yes', 'no'].map((value) => (
            <TabPanel key={value} value={value} className="mt-2 text-black">
              {value === 'yes'
                ? 'The project has received prior funding.'
                : 'The project has not received prior funding.'}
            </TabPanel>
          ))}
        </TabsBody>
      </Tabs>

      <label className="block">
        If so, please describe
        <input
          type="text"
          className="mt-1 block w-full rounded-none border-gray-300 text-black shadow-sm focus:border-[#C5D3D6] focus:ring focus:ring-[#C5D3D6] focus:ring-opacity-50"
          {...register('prior_funding_details')}
        />
      </label>

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
      <Tabs value={isLeadContributor}>
        <TabsHeader className="bg-gray-100">
          {['yes', 'no'].map((value) => (
            <Tab
              key={value}
              value={value}
              onClick={() => setIsLeadContributor(value)}
              className="text-black"
            >
              {value === 'yes' ? 'Yes' : 'No'}
            </Tab>
          ))}
        </TabsHeader>
        <TabsBody>
          {['yes', 'no'].map((value) => (
            <TabPanel key={value} value={value} className="mt-2 text-black">
              {value === 'yes'
                ? 'You are the Project Lead / Lead Contributor.'
                : 'You are not the Project Lead / Lead Contributor.'}
            </TabPanel>
          ))}
        </TabsBody>
      </Tabs>

      <label className="block">
        If someone else, please list the project's Lead Contributor or
        Maintainer
        <input
          type="text"
          className="mt-1 block w-full rounded-none border-gray-300 text-black shadow-sm focus:border-[#C5D3D6] focus:ring focus:ring-[#C5D3D6] focus:ring-opacity-50"
          {...register('other_lead')}
        />
      </label>

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
          className="mt-1 block w-full rounded-none border-gray-300 text-black shadow-sm focus:border-[#C5D3D6] focus:ring focus:ring-[#C5D3D6] focus:ring-opacity-50"
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
