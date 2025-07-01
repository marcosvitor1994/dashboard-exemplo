export function processData(values) {
  if (!values || values.length < 2) {
    return { campaigns: [], influencers: [], posts: [] }
  }

  const headers = values[0]
  const rows = values.slice(1)

  const posts = rows
    .map((row, rowIndex) => {
      const post = {}
      headers.forEach((header, i) => {
        post[header] = row[i] || ""
      })
      post.id = `post-${rowIndex}`
      return post
    })
    .filter((post) => post.Influencer)

  const campaignsMap = new Map()
  const influencersMap = new Map()

  posts.forEach((post) => {
    // Process Campaigns
    if (post.Campanha) {
      if (!campaignsMap.has(post.Campanha)) {
        campaignsMap.set(post.Campanha, { name: post.Campanha, postCount: 0, influencerCount: new Set() })
      }
      const campaign = campaignsMap.get(post.Campanha)
      campaign.postCount += 1
      campaign.influencerCount.add(post.Influencer)
    }

    // Process Influencers
    if (post.Influencer) {
      if (!influencersMap.has(post.Influencer)) {
        influencersMap.set(post.Influencer, { name: post.Influencer, postCount: 0, campaignCount: new Set() })
      }
      const influencer = influencersMap.get(post.Influencer)
      influencer.postCount += 1
      influencer.campaignCount.add(post.Campanha)
    }
  })

  const campaigns = Array.from(campaignsMap.values()).map((c) => ({ ...c, influencerCount: c.influencerCount.size }))
  const influencers = Array.from(influencersMap.values()).map((i) => ({ ...i, campaignCount: i.campaignCount.size }))

  return { campaigns, influencers, posts }
}
