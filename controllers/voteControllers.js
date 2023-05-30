import Votes from '../models/upVoteModel.js'

const postUpVote = async (req, res) => {
  let { postID } = req.params
  postID = postID.replace('\n', '')
  console.log(postID)
  try {
    const vote = await Votes.findOne({ postID })

    const existingUserIndex = vote.Votes.findIndex(
      (val) => val.userID === req.body.userID,
    )
    if (existingUserIndex > -1) {
      // User already exists, update the voteType
      vote.Votes[existingUserIndex].voteType = req.body.voteType
    } else {
      // User doesn't exist, add a new entry
      vote.Votes.push({ userID: req.body.userID, voteType: req.body.voteType })
    }

    const updateUpVote = await vote.save()

    return res.status(200).json({ upvote: updateUpVote })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ msg: error })
  }
}

const getVotes = async (req, res) => {
  const { userID } = req.params

  try {
    const votes = await Votes.aggregate([
      { $match: { 'Votes.userID': userID } },
      {
        $project: {
          postID: 1,
          Votes: {
            $filter: {
              input: '$Votes',
              as: 'vote',
              cond: { $eq: ['$$vote.userID', userID] },
            },
          },
        },
      },
    ])

    if (votes.length === 0) {
      return res.status(400).json({ msg: 'No votes for this user' })
    }

    return res.status(200).json({ voteData: votes })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ msg: 'Error' })
  }
}
const deleteVote = async (req, res) => {
  let { voteID } = req.params
  console.log(req.body)
  const vote = await Votes.findById(voteID)
  console.log(vote)
  if (!vote) {
    return res.status(404).json({ msg: 'no vote ' })
  }
  await Votes.findOneAndDelete({ _id: voteID })
  return res.status(200).json({ msg: 'post deleted' })
}
export { postUpVote, getVotes, deleteVote }
