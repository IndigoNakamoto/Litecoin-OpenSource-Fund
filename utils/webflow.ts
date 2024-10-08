// /utils/webflow.ts
import axios, { AxiosInstance } from 'axios'
import dotenv from 'dotenv'

// Load environment variables from .env file
dotenv.config()

// Type Definitions
interface WebflowResponse<T> {
  items: T[]
  count: number
  total: number
  limit: number
  offset: number
}

interface Contributor {
  id: string
  name: string
  slug: string
  isDraft: boolean
  isArchived: boolean
  fieldData: ContributorFieldData
}

interface ProjectWithUpdatesAndContributors extends ProjectWithUpdates {
  litecoinContributors: Contributor[]
  bitcoinContributors: Contributor[]
  advocates: Contributor[]
}

interface ContributorFieldData {
  'profile-picture': string
  'project-as-contributor': string[] // Should be array if multiple projects
  'projects-as-litecoin-contributor': string[] // Should be array if multiple projects
  'projects-as-bitcoin-contributor': string[] // Should be array if multiple projects
  'twitter-link': string
  'discord-link': string
  'github-link': string
  'youtube-link': string
  'linkedin-link': string
  email: string
}

interface Project {
  id: string
  cmsLocaleId: string
  lastPublished: string
  lastUpdated: string
  createdOn: string
  isArchived: boolean
  isDraft: boolean
  fieldData: ProjectFieldData
}

interface ProjectFieldData {
  'github-link': string
  'telegram-link': string
  'facebook-link': string
  'discord-link': string
  'reddit-link': string
  'website-link': string
  hidden: boolean
  recurring: boolean
  'service-fees-collected': number
  'total-paid': number
  summary: string
  name: string
  slug: string
  content: string
  'bitcoin-contributors-2': string[]
  'litecoin-contributors-2': string[]
  'advocates-2': string[]
  hashtags: string[]
  'content-2': string
  'content-rich': string
  status: string
}

export interface Post {
  _id: string
  title: string
  slug: string
  fieldData: {
    'x-post-link': string
    'youtube-link': string
    'reddit-link': string
    // Add a reference to the project ID
    projects?: string[] // Assuming you have this field as an array
  }
  // Add other relevant fields
}

export interface Update {
  id: string
  slug: string
  isArchived: boolean
  isDraft: boolean
  fieldData: UpdateFieldData
}

interface UpdateFieldData {
  content: string
  summary: string
  name: string
  slug: string
  author: string
  project: string
}

// Extended Type for Project with Updates
interface ProjectWithUpdates extends Project {
  updates: Update[]
}

interface MatchingDonor {
  id: string
  slug: string
  isDraft: boolean
  isArchived: boolean
  fieldData: MatchingDonorFieldData
}

interface MatchingDonorFieldData {
  name: string
  'matching-type': string // Option field, returns option ID
  'total-matching-amount': number
  'remaining-matching-amount': number
  'supported-projects'?: string[]
  'start-date': string
  'end-date': string
  multiplier?: number
  status: string // Option field, returns option ID
  contributor?: string
  // other fields...
}

// Additional Interfaces for Collection Schema
interface CollectionSchemaField {
  id: string
  isEditable: boolean
  isRequired: boolean
  type: string // e.g., "Option", "PlainText"
  slug: string // e.g., "status", "matching-type"
  displayName: string // e.g., "Status", "Matching Type"
  helpText: string | null
  validations?: {
    options?: Array<{
      id: string
      name: string
    }>
    // other validations...
  }
}

interface CollectionSchema {
  id: string
  displayName: string
  singularName: string
  slug: string
  createdOn: string
  lastUpdated: string
  fields: CollectionSchemaField[]
}

interface ProjectSummaryLiteFieldData {
  summary: string
  name: string
  slug: string
  'cover-image': {
    fileId: string
    url: string
    alt: string | null
  }
  status: string // Mapped label
}

interface ProjectSummaryLite {
  id: string
  lastUpdated: string
  createdOn: string
  fieldData: ProjectSummaryLiteFieldData
}

export interface FAQItem {
  id: string
  slug: string
  isArchived: boolean
  isDraft: boolean
  fieldData: FAQFieldData
}

interface FAQFieldData {
  question: string
  answer: string
  category: string
  project: string // Reference to the Project ID
  order?: number
}

// Environment Variables
const API_TOKEN = process.env.WEBFLOW_API_TOKEN_TEST_REDESIGN_LITE_SPACE
const COLLECTION_ID_PROJECTS = process.env.WEBFLOW_COLLECTION_ID_PROJECTS
const COLLECTION_ID_POSTS = process.env.WEBFLOW_COLLECTION_ID_POSTS
const COLLECTION_ID_UPDATES = process.env.WEBFLOW_COLLECTION_ID_PROJECT_UPDATES
const COLLECTION_ID_CONTRIBUTORS =
  process.env.WEBFLOW_COLLECTION_ID_CONTRIBUTORS
const COLLECTION_ID_MATCHING_DONORS =
  process.env.WEBFLOW_COLLECTION_ID_MATCHING_DONORS
const COLLECTION_ID_FAQS = process.env.WEBFLOW_COLLECTION_ID_FAQS

if (
  !API_TOKEN ||
  !COLLECTION_ID_PROJECTS ||
  !COLLECTION_ID_POSTS ||
  !COLLECTION_ID_UPDATES ||
  !COLLECTION_ID_CONTRIBUTORS ||
  !COLLECTION_ID_MATCHING_DONORS ||
  !COLLECTION_ID_FAQS
) {
  throw new Error('Missing one or more required environment variables.')
}

// Axios Client Setup
const webflowClient: AxiosInstance = axios.create({
  baseURL: 'https://api.webflow.com/v2',
  headers: {
    Authorization: `Bearer ${API_TOKEN}`,
    'accept-version': '1.0.0',
    'Content-Type': 'application/json',
  },
})

let cachedStatusMap: Map<string, string> | null = null
let cachedMatchingTypeMap: Map<string, string> | null = null
let cachedProjectStatusMap: Map<string, string> | null = null
/**
 * Initialize and cache the option maps for 'status' and 'matching-type'.
 */
const initializeOptionMaps = async () => {
  if (!cachedStatusMap) {
    cachedStatusMap = await createOptionIdToLabelMap(
      COLLECTION_ID_MATCHING_DONORS,
      'status'
    )
  }

  if (!cachedMatchingTypeMap) {
    cachedMatchingTypeMap = await createOptionIdToLabelMap(
      COLLECTION_ID_MATCHING_DONORS,
      'matching-type'
    )
  }

  // Initialize the project status map if not already done
  if (!cachedProjectStatusMap) {
    cachedProjectStatusMap = await createOptionIdToLabelMap(
      COLLECTION_ID_PROJECTS,
      'status'
    )
  }
}

/**
 * Get the label for a given field ID from a specified collection.
 * @param collectionId - The ID of the collection.
 * @param fieldSlug - The slug of the field.
 * @param fieldId - The option ID for the field.
 * @returns The label corresponding to the field ID.
 */
export const getLabel = async (
  collectionId: string,
  fieldSlug: string,
  fieldId: string
): Promise<string> => {
  // Ensure all necessary option maps are initialized
  await initializeOptionMaps()

  let label = 'Unknown'

  if (
    collectionId === COLLECTION_ID_MATCHING_DONORS &&
    fieldSlug === 'status'
  ) {
    label = cachedStatusMap?.get(fieldId) || 'Unknown Status'
  } else if (
    collectionId === COLLECTION_ID_MATCHING_DONORS &&
    fieldSlug === 'matching-type'
  ) {
    label = cachedMatchingTypeMap?.get(fieldId) || 'Unknown Matching Type'
  } else if (
    collectionId === COLLECTION_ID_PROJECTS &&
    fieldSlug === 'status'
  ) {
    label = cachedProjectStatusMap?.get(fieldId) || 'Unknown Status'
  }

  return label
}

/**
 * Get the label for a given status ID.
 * @param statusId - The option ID for status.
 * @returns The label corresponding to the status ID.
 */
export const getStatusLabel = async (statusId: string): Promise<string> => {
  await initializeOptionMaps()
  return cachedStatusMap?.get(statusId) || 'Unknown Status'
}

/**
 * Get the label for a given matching type ID.
 * @param matchingTypeId - The option ID for matching type.
 * @returns The label corresponding to the matching type ID.
 */
export const getMatchingTypeLabel = async (
  matchingTypeId: string
): Promise<string> => {
  await initializeOptionMaps()
  return cachedMatchingTypeMap?.get(matchingTypeId) || 'Unknown Matching Type'
}

/**
 * Fetch the collection schema for a given collection ID.
 * @param collectionId - The ID of the collection.
 * @returns The collection schema.
 */
export const getCollectionSchema = async (
  collectionId: string
): Promise<CollectionSchema> => {
  try {
    const response = await webflowClient.get<CollectionSchema>(
      `/collections/${collectionId}`
    )
    return response.data
  } catch (error) {
    console.error(
      `Error fetching collection schema for ${collectionId}:`,
      error
    )
    throw error
  }
}

export const createOptionIdToLabelMap = async (
  collectionId: string,
  fieldSlug: string
): Promise<Map<string, string>> => {
  const schema = await getCollectionSchema(collectionId)
  const field = schema.fields.find((f) => f.slug === fieldSlug)

  if (!field) {
    const availableFields = schema.fields
      .map((f) => f.slug || f.displayName || f.type)
      .join(', ')
    throw new Error(
      `Field "${fieldSlug}" not found in collection ${collectionId}. Available fields: ${availableFields}`
    )
  }

  if (!field.validations || !field.validations.options) {
    throw new Error(
      `Field "${fieldSlug}" is not an Option field in collection ${collectionId}. Field type: ${field.type}`
    )
  }

  const map = new Map<string, string>()
  field.validations.options.forEach((option) => {
    map.set(option.id, option.name.trim())
  })

  return map
}

/**
 * Function to list collection items with pagination.
 * @param collectionId - The ID of the collection.
 * @param params - Additional query parameters.
 * @returns An array of collection items.
 */
const listCollectionItems = async <T>(
  collectionId: string,
  params: Record<string, any> = {}
): Promise<T[]> => {
  let items: T[] = []
  let offset = 0
  let total = 0
  const limit = 100

  try {
    do {
      const response = await webflowClient.get<WebflowResponse<T>>(
        `/collections/${collectionId}/items`,
        {
          params: {
            limit,
            offset,
            ...params,
          },
        }
      )
      items = items.concat(response.data.items)
      total = response.data.total
      offset += limit
    } while (items.length < total)

    return items
  } catch (error: any) {
    console.error(
      `Error fetching items from collection ${collectionId}:`,
      error.response?.data || error.message
    )
    throw error
  }
}

export const getFAQsByProjectId = async (
  projectId: string
): Promise<FAQItem[]> => {
  const faqs = await listCollectionItems<FAQItem>(COLLECTION_ID_FAQS)

  // Filter FAQs by project ID and exclude drafts and archived items
  const projectFAQs = faqs
    .filter(
      (faq) =>
        faq.fieldData.project === projectId && !faq.isDraft && !faq.isArchived
    )
    .sort((a, b) => (a.fieldData.order || 0) - (b.fieldData.order || 0)) // Optional sorting

  return projectFAQs
}

/**
 * Get FAQs for a specific project by its slug.
 * @param slug - The slug of the project.
 * @returns An array of FAQItems related to the project or an empty array if the project is not found.
 */
export const getFAQsByProjectSlug = async (
  slug: string
): Promise<FAQItem[]> => {
  // Fetch the project using its slug
  const project = await getProjectBySlug(slug)

  if (!project) {
    console.warn(`No project found with slug "${slug}".`)
    return []
  }

  // Use the existing function to get FAQs by project ID
  const faqs = await getFAQsByProjectId(project.id)

  return faqs
}

export const getActiveMatchingDonors = async (): Promise<MatchingDonor[]> => {
  const donors = await listCollectionItems<MatchingDonor>(
    COLLECTION_ID_MATCHING_DONORS
  )

  const now = new Date()

  // Use field slugs to get the option maps
  const statusMap = await createOptionIdToLabelMap(
    COLLECTION_ID_MATCHING_DONORS,
    'status'
  )
  const matchingTypeMap = await createOptionIdToLabelMap(
    COLLECTION_ID_MATCHING_DONORS,
    'matching-type'
  )

  // Filter active donors within the date range and with remaining matching amount
  const activeDonors = donors.filter((donor) => {
    const startDate = new Date(donor.fieldData['start-date'])
    const endDate = new Date(donor.fieldData['end-date'])

    const statusId = donor.fieldData['status']

    const statusLabel = statusMap.get(statusId) || 'Unknown Status'

    const isActive = statusLabel === 'Active'
    const withinDateRange = now >= startDate && now <= endDate

    // This has to be calculated from prisma model logs
    const hasRemainingAmount = donor.fieldData['remaining-matching-amount'] > 0

    return (
      isActive &&
      withinDateRange &&
      hasRemainingAmount &&
      !donor.isDraft &&
      !donor.isArchived
    )
  })

  return activeDonors
}

export const getMatchingTypeLabelForDonor = async (
  donor: MatchingDonor
): Promise<string> => {
  // Use field slugs to get the option map for matching-type
  const matchingTypeMap = await createOptionIdToLabelMap(
    COLLECTION_ID_MATCHING_DONORS,
    'matching-type'
  )

  // Retrieve the matching type ID from the donor's fieldData
  const matchingTypeId = donor.fieldData['matching-type']

  // Find the corresponding label from the matching type map
  const matchingTypeLabel =
    matchingTypeMap.get(matchingTypeId) || 'Unknown Matching Type'

  return matchingTypeLabel
}

/**
 * Get a single project by its slug along with its related updates and contributors.
 * @param slug - The slug of the project.
 * @returns The project object with associated updates and contributors or undefined if not found.
 */
export const getProjectBySlug = async (
  slug: string
): Promise<ProjectWithUpdatesAndContributors | undefined> => {
  // Fetch the project by slug
  const projectResponse = await webflowClient.get<WebflowResponse<Project>>(
    `/collections/${COLLECTION_ID_PROJECTS}/items`,
    {
      params: { slug },
    }
  )

  const project = projectResponse.data.items[0]

  if (!project) {
    // No project found with the given slug
    return undefined
  }

  // Fetch all updates
  const updates = await getAllUpdates()

  // Filter updates related to the fetched project
  const projectUpdates = updates.filter(
    (update) => update.fieldData.project === project.id
  )

  // Fetch all active contributors
  const allContributors = await getAllActiveContributors()

  // Helper function to fetch contributor details by IDs
  const getContributorsByIds = (ids: string[]): Contributor[] => {
    return allContributors.filter((contributor) => ids.includes(contributor.id))
  }

  // Get contributors for each category
  const litecoinContributors = getContributorsByIds(
    project.fieldData['litecoin-contributors-2'] || []
  )

  const bitcoinContributors = getContributorsByIds(
    project.fieldData['bitcoin-contributors-2'] || []
  )

  const advocates = getContributorsByIds(project.fieldData['advocates-2'] || [])

  // Return the project along with its updates and contributors
  const projectWithContributors: ProjectWithUpdatesAndContributors = {
    ...project,
    updates: projectUpdates,
    litecoinContributors,
    bitcoinContributors,
    advocates,
  }

  return projectWithContributors
}

export const getContributorsByIds = async (
  contributors: string[]
): Promise<string> => {
  // Fetch all active contributors
  const allContributors = await getAllActiveContributors()

  // Helper function to fetch contributor details by IDs
  const getContributorsByIds = (contributors: string[]): string[] => {
    return allContributors
      .filter((contributor) => contributors.includes(contributor.id))
      .map((contributor) => {
        const twitterLink = contributor.fieldData['twitter-link']
        // Extract the Twitter handle from the link (removes the URL part)
        return twitterLink
          .replace('http://x.com/', '')
          .replace('https://x.com/', '')
      })
  }

  return getContributorsByIds(contributors).join(',')
}

/**
 * Get all contributors.
 * @returns An array of all contributors.
 */
export const getAllContributors = async (): Promise<Contributor[]> => {
  const contributors = await listCollectionItems<Contributor>(
    COLLECTION_ID_CONTRIBUTORS
  )
  return contributors
}

/**
 * Get all active contributors.
 * @returns An array of active contributors.
 */
export const getAllActiveContributors = async (): Promise<Contributor[]> => {
  const contributors = await getAllContributors()
  // Filter out draft and archived contributors
  return contributors.filter(
    (contributor) => !contributor.isDraft && !contributor.isArchived
  )
}

/**
 * Get all active (non-archived and non-draft) projects with selected fields.
 * @returns An array of ProjectSummaryLite objects.
 */
export const getAllProjects = async (): Promise<ProjectSummaryLite[]> => {
  try {
    // Fetch all projects from the Webflow collection
    const projects = await listCollectionItems<Project>(COLLECTION_ID_PROJECTS)

    // Filter out archived and draft projects
    const activeProjects = projects.filter(
      (project) => !project.isArchived && !project.isDraft
    )

    // Map each active project to the ProjectSummaryLite structure
    const projectSummaries: ProjectSummaryLite[] = await Promise.all(
      activeProjects.map(async (project) => {
        // Map the status ID to its label using the projects collection
        const statusLabel = await getLabel(
          COLLECTION_ID_PROJECTS,
          'status',
          project.fieldData.status
        )

        // Return the summarized project data
        return {
          id: project.id,
          lastUpdated: project.lastUpdated,
          createdOn: project.createdOn,
          fieldData: {
            summary: project.fieldData.summary,
            name: project.fieldData.name,
            slug: project.fieldData.slug,
            'cover-image': project.fieldData['cover-image'], // Properly typed
            status: statusLabel,
          },
        }
      })
    )

    return projectSummaries
  } catch (error) {
    console.error('Error fetching and processing projects:', error)
    throw error
  }
}

/**
 * Get all posts.
 * @returns An array of all posts.
 */
export const getAllPosts = async (): Promise<Post[]> => {
  const posts = await listCollectionItems<Post>(COLLECTION_ID_POSTS)
  // TODO: posts[0].fieldData.hashtags.forEach get post
  return posts
}

/**
 * Get all updates.
 * @returns An array of all updates.
 */
export const getAllUpdates = async (): Promise<Update[]> => {
  const updates = await listCollectionItems<Update>(COLLECTION_ID_UPDATES)
  return updates
}

export const getProjectUpdates = async (): Promise<Update[]> => {
  const updates = await getAllUpdates()
  return updates
}

/**
 * Get updates for a specific project by slug.
 * @param slug - The slug of the project.
 * @returns An array of updates related to the project.
 */
export const getProjectUpdatesBySlug = async (
  slug: string
): Promise<Update[]> => {
  const project = await getProjectBySlug(slug)
  if (!project) return []
  const allUpdates = await getAllUpdates()

  // Filter out archived and draft updates
  return allUpdates.filter(
    (update) =>
      update.fieldData.project === project.id &&
      !update.isArchived &&
      !update.isDraft
  )
}

/**
 * Get posts matching a given slug.
 * @param slug - The slug to match.
 * @returns An array of posts matching the slug.
 */
export const getPostsBySlug = async (slug: string): Promise<Post[]> => {
  try {
    const project = await getProjectBySlug(slug)
    const filteredPosts = await getPostsByProjectIdLocal(project?.id || '')
    return filteredPosts
  } catch (error) {
    console.error(`Error fetching posts with slug ${slug}:`, error)
    return []
  }
}

/**
 * Get all posts associated with a specific project ID.
 * TODO: return only posts where isArhived = false
 * @param projectId - The ID of the project.
 * @returns An array of posts related to the project.
 */
export const getPostsByProjectIdLocal = async (
  projectId: string
): Promise<Post[]> => {
  const allPosts = await getAllPosts()
  //
  const filteredPosts = allPosts.filter((post) => {
    const projects = post.fieldData['projects']

    return Array.isArray(projects) && projects.includes(projectId)
  })
  return filteredPosts
}

// Add a new cache for projects by ID
const cachedProjectsMap: Map<string, ProjectSummaryLite> = new Map()

/**
 * Initialize and cache all projects in a Map for quick lookup by ID.
 */
const initializeProjectsMap = async () => {
  if (cachedProjectsMap.size === 0) {
    const projects = await getAllProjects()
    projects.forEach((project) => {
      cachedProjectsMap.set(project.id, project)
    })
  }
}

/**
 * Get the list of supported projects for a given MatchingDonor.
 * @param donor - The MatchingDonor object.
 * @returns An array of Project slugs that the donor supports.
 */
export const getSupportedProjectsForDonor = async (
  donor: MatchingDonor
): Promise<string[]> => {
  // Ensure the projects map is initialized and cached
  await initializeProjectsMap()

  // Extract supported project IDs from the donor
  const supportedProjectIds = donor.fieldData['supported-projects']

  if (!supportedProjectIds || supportedProjectIds.length === 0) {
    console.log(
      `Donor "${donor.fieldData['name']}" does not support any projects.`
    )
    return []
  }

  // Retrieve the corresponding Project objects from the cached map
  const supportedProjects: string[] = supportedProjectIds
    .map((projectId) => {
      const project = cachedProjectsMap.get(projectId)
      if (!project) {
        console.warn(
          `Project with ID "${projectId}" not found for donor "${donor.fieldData['name']}".`
        )
      }
      return project?.fieldData.slug
    })
    .filter((projectSlug): projectSlug is string => projectSlug !== undefined)

  // Log the supported projects for debugging
  console.log(
    `Donor "${donor.fieldData['name']}" supports ${supportedProjects.length} project(s):`,
    supportedProjects
  )

  return supportedProjects
}
