//components/WebsiteApplicationForm.tsx
import { useRouter } from 'next/router'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { fetchPostJSON } from '../utils/api-helpers'
import FormButton from '@/components/FormButton'
import React from 'react'

export default function ApplicationForm() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const {
    watch,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const isFLOSS = watch('free_open_source', false)
  const [failureReason, setFailureReason] = useState<string>()

  const onSubmit = async (data: any) => {
    setLoading(true)
    // console.log(data)

    try {
      // Track application in GitHub
      const res = await fetchPostJSON('/api/github', data)
      if (res.message === 'success') {
        router.push('/submitted')
        setLoading(false)
      } else {
        setFailureReason('Submission failed. Please try again.')
      }
    } catch (e) {
      // Handle errors from the fetch operation
      if (e instanceof Error) {
        setFailureReason(`Error: ${e.message}`)
      } else {
        setFailureReason('An unknown error occurred.')
      }
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="apply flex max-w-2xl flex-col gap-4 pt-8"
    >
      <input type="hidden" {...register('explore_page', { value: true })} />

      <hr />
      <h2>Project Details</h2>

      <label className="block">
        Main Focus
        <br />
        <small>In which area will your project have the most impact?</small>
        <select
          className="mt-1 block w-full rounded-md border-gray-300 text-black shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          {...register('main_focus')}
        >
          <option value="litecoin">Litecoin</option>
          <option value="lightning">Lightning</option>
          <option value="mweb">MWEB</option>
          <option value="ordinals">Ordinals Lite</option>
          <option value="omnilite">Omni Lite</option>
          <option value="ldk">Litecoin Dev Kit</option>
          <option value="education">Education</option>
          <option value="other">Other</option>
        </select>
      </label>

      <label className="block">
        Project Name *<br />
        <small>
          The name of the project to be listed on the Lite.Space website
        </small>
        <input
          type="text"
          className="mt-1 block w-full rounded-md border-gray-300 text-black shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          {...register('project_name', { required: true })}
        />
      </label>

      <label className="block">
        Project Description *<br />
        <small>
          This will be listed on the explore projects page of the Lite.Space
          website. Please write at least 2-3 sentences.
        </small>
        <textarea
          className="mt-1 block w-full rounded-md border-gray-300 text-black shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          {...register('short_description', { required: true })}
        />
      </label>

      <label className="block">
        Potential Impact *<br />
        <small>
          Why is this project important to Litecoin or the broader free and
          open-source community?
        </small>
        <textarea
          className="mt-1 block w-full rounded-md border-gray-300 text-black shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          {...register('potential_impact', { required: true })}
        />
      </label>

      <hr />
      <h2>Project Links</h2>

      <label className="block">
        Project Repository *<br />
        <small>GitHub, GitLab, Bitbucket, Gitea, or similar</small>
        <input
          type="text"
          className="mt-1 block w-full rounded-md border-gray-300 text-black shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          {...register('github', { required: true })}
        />
      </label>

      <label className="block">
        Project-specific Social Media
        <br />
        <small>
          Please include any project-specific social media or common community
          Discord, etc.
        </small>
        <textarea
          className="mt-1 block w-full rounded-md border-gray-300 text-black shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          {...register('social_media')}
        />
      </label>

      <label className="block">
        Additional Project Links
        <br />
        <small>
          Other links that might be relevant, such as website, documentation,
          links to app stores, etc.
        </small>
        <textarea
          className="mt-1 block w-full rounded-md border-gray-300 text-black shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          {...register('relevant_links')}
        />
      </label>

      <label className="inline-flex items-center">
        <input
          type="checkbox"
          className="rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          {...register('free_open_source', { required: true })}
        />
        <span className="ml-2">Is the project free and open-source? *</span>
      </label>

      <hr />
      <h2>Applicant Details</h2>

      <label className="block">
        Your Name *<br />
        <small>Feel free to use your nym.</small>
        <input
          type="text"
          className="mt-1 block w-full rounded-md border-gray-300 text-black shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          placeholder="Satoshi Nakamoto"
          {...register('your_name', { required: true })}
        />
      </label>
      <label className="block">
        Email *
        <input
          type="email"
          className="mt-1 block w-full rounded-md border-gray-300 text-black shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          placeholder="litoshi@lite.space"
          {...register('email', { required: true })}
        />
      </label>
      <label className="inline-flex items-center">
        <input
          type="checkbox"
          className="rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          {...register('are_you_lead')}
        />
        <span className="ml-2">
          Are you the Project Lead / Lead Contributor?
        </span>
      </label>
      <label className="block">
        If someone else, please list the project's Lead Contributor or
        Maintainer{' '}
        <input
          type="text"
          className="mt-1 block w-full rounded-md border-gray-300 text-black shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          {...register('other_lead')}
        />
      </label>

      <hr />
      <h2>Applicant Links</h2>

      <label className="block">
        Personal Github (or similar, if applicable)
        <input
          type="text"
          className="mt-1 block w-full rounded-md border-gray-300 text-black shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          {...register('personal_github')}
        />
      </label>
      <label className="block">
        References *<br />
        <small>
          Please list any references from the Litecoin community or open-source
          space that we could contact for more information on you or your
          project.
        </small>
        <textarea
          className="mt-1 block w-full rounded-md border-gray-300 text-black shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          {...register('references', { required: true })}
        />
      </label>
      <label className="block">
        Other Contact Details (if applicable)
        <br />
        <small>
          Please list any other relevant contact details you are comfortable
          sharing in case we need to reach out with questions. These could etc.
        </small>
        <textarea
          className="mt-1 block w-full rounded-md border-gray-300 text-black shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          {...register('other_contact')}
        />
      </label>

      <div className="markdown">
        <small>
          Lite.Space may require each recipient to sign a Grant Agreement before
          any funds are disbursed. Using the reports and presentations required
          by the Grant Agreement, Lite.Space will monitor and evaluate the
          expenditure of funds on a quarterly basis. Any apparent misuse of
          grant funds will be promptly investigated. If Lite.Space discovers
          that the funds have been misused, the recipient will be required to
          return the funds immediately, and be barred from further
          distributions. Lite.Space will maintain the records required by
          Revenue Ruling 56-304, 1956-2 C.B. 306 regarding distribution of
          charitable funds to individuals.
        </small>
      </div>

      <FormButton
        variant={isFLOSS ? 'enabled' : 'disabled'}
        type="submit"
        disabled={loading}
      >
        Submit Listing Request
      </FormButton>

      {!!failureReason && (
        <p className="rounded bg-red-500 p-4 text-white">
          Something went wrong! {failureReason}
        </p>
      )}
    </form>
  )
}
