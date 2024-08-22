import { useRouter } from 'next/router'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { fetchPostJSON } from '../utils/api-helpers'
import FormButton from '@/components/FormButton'
import React, { memo } from 'react'
import {
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
  Typography,
} from '@material-tailwind/react'

// Memoize the Tabs component to prevent unnecessary re-renders
const MemoizedTabs = memo(function TabsComponent({
  id,
  ariaLabelledBy,
  value,
  setValue,
  descriptions,
}: {
  id: string
  ariaLabelledBy: string
  value: string
  setValue: (value: string) => void
  descriptions: { yes: string; no: string }
}) {
  return (
    <Tabs
      id={id}
      value={value}
      className="mt-1"
      aria-labelledby={ariaLabelledBy}
    >
      <TabsHeader className="bg-gray-100">
        <Tab value="yes" onClick={() => setValue('yes')}>
          Yes
        </Tab>
        <Tab value="no" onClick={() => setValue('no')}>
          No
        </Tab>
      </TabsHeader>
      <TabsBody>
        <TabPanel value="yes">
          <Typography variant="small" color="blue-gray" className="mt-2">
            {descriptions.yes}
          </Typography>
        </TabPanel>
        <TabPanel value="no">
          <Typography variant="small" color="blue-gray" className="mt-2">
            {descriptions.no}
          </Typography>
        </TabPanel>
      </TabsBody>
    </Tabs>
  )
})

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

    // Restructure the form data
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
        console.error('Error submitting project:', e.message) // Log the error
      } else {
        setFailureReason('An unknown error occurred.')
      }
      setLoading(false) // Ensure loading state is reset
    }
  }

  const buttonVariant = isValid && isDirty ? 'enabled' : 'disabled'

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex max-w-2xl flex-col gap-4"
    >
      <input type="hidden" {...register('project', { value: true })} />

      <h2>Project Overview</h2>

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

      <label htmlFor="is_open_source" className="block">
        Is the project open-source? <span className="text-red-500">*</span>
      </label>
      <MemoizedTabs
        id="is_open_source"
        ariaLabelledBy="is_open_source"
        value={openSource}
        setValue={setOpenSource}
        descriptions={{
          yes: 'The project is open-source and available to the community.',
          no: 'The project is not open-source.',
        }}
      />

      <h2>Project Budget</h2>

      <label className="block">
        Proposed Budget <span className="text-red-500">*</span>
        <textarea
          className="mt-1 block w-full rounded-none border-gray-300 text-black shadow-sm focus:border-[#C5D3D6] focus:ring focus:ring-[#C5D3D6] focus:ring-opacity-50"
          {...register('proposed_budget', { required: true })}
        />
      </label>

      <label htmlFor="received_funding" className="block">
        Has this project received any prior funding?
      </label>
      <MemoizedTabs
        id="received_funding"
        ariaLabelledBy="received_funding"
        value={receivedFunding}
        setValue={setReceivedFunding}
        descriptions={{
          yes: 'The project has received prior funding.',
          no: 'The project has not received prior funding.',
        }}
      />

      <label className="block">
        If so, please describe
        <input
          type="text"
          className="mt-1 block w-full rounded-none border-gray-300 text-black shadow-sm focus:border-[#C5D3D6] focus:ring focus:ring-[#C5D3D6] focus:ring-opacity-50"
          {...register('prior_funding_details')}
        />
      </label>

      <h2>Applicant Information</h2>

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

      <label htmlFor="lead_contributor" className="block">
        Are you the Project Lead / Lead Contributor?
      </label>
      <MemoizedTabs
        id="lead_contributor"
        ariaLabelledBy="lead_contributor"
        value={isLeadContributor}
        setValue={setIsLeadContributor}
        descriptions={{
          yes: 'You are the Project Lead / Lead Contributor.',
          no: 'You are not the Project Lead / Lead Contributor.',
        }}
      />

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

      {/* TODO: Fix disabled enabled styles */}
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
