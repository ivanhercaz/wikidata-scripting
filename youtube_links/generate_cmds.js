#!/usr/bin/env node
const list = require('./item_with_youtube_channel.json')
const fetchLink = require('./fetch_links')

const buildNextCommand = () => {
  const { item: id, youtube: channelId } = list.shift()

  return fetchLink(channelId)
  .then(generateCommandsFromLinks(id, channelId))
  .then(buildNextCommand)
}

const generateCommandsFromLinks = (id, channelId) => links => {
  if (!links) return

  console.log(`entity=$(wd data ${id} --props claims)`)
  Object.keys(links).forEach(property => {
    const value = links[property]
    console.log(`echo $entity | jd claims.${property} || {
      claim_guid=$(wd add-claim ${id} ${property} ${value} | jd claim.id)
      wd add-reference $claim_guid P854 "https://www.youtube.com/channel/${channelId}"
    }`)
  })
  console.log('')
}

buildNextCommand()
