// const postDownVote = async (req, res) => {
//   let { postID } = req.params
//   postID = postID.replace('\n', '')

//   try {
//     const vote = await Votes.findOne({ postID })

//     let findUser = vote.downVotes.find((val) => val.userID === req.body.userID)
//     if (findUser) {
//       return res.status(400).json({ msg: 'Already Down Voted' })
//     }

//     const updateDownVote = await Votes.findByIdAndUpdate(
//       vote._id,
//       { $push: { downVotes: { userID: req.body.userID } } },
//       {
//         new: true,
//         runValidators: true,
//       },
//     )

//     return res.status(200).json({ downvote: updateDownVote })
//   } catch (error) {
//     console.log(error)
//     return res.status(500).json({ msg: error })
//   }
// }
// const deleteVote = async (req, res) => {
//   console.log(req)
//   let { postID } = req.params
//   postID = postID.replace('\n', '')

//   try {
//     const vote = await Votes.findOne({ postID })
//     console.log(vote)

//     let findUser = vote.upVotes.find((val) => val.userID === req.body.userID)
//     if (!findUser) {
//       return res
//         .status(201)
//         .json({ msg: 'Value Cant be deleted because it does not exist' })
//     }

//     await Votes.findOneAndDelete({ postID, userID: req.body.userID }) // Delete the specific vote based on postID and userID
//     return res.status(200).json({ vote })
//   } catch (error) {
//     console.log(error)
//     return res.status(500).json({ msg: error })
//   }
// }
// const deleteDownVote = async (req, res) => {
//   let { postID } = req.params
//   postID = postID.replace('\n', '')

//   try {
//     const vote = await Votes.findOne({ postID })
//     console.log(vote)

//     let findUser = vote.downVotes.find((val) => val.userID === req.body.userID)
//     if (!findUser) {
//       return res
//         .status(201)
//         .json({ msg: 'Value Cant be deleted because it does not exist' })
//     }

//     await Votes.findOneAndDelete({ postID, userID: req.body.userID }) // Delete the specific vote based on postID and userID
//     return res.status(200).json({ vote })
//   } catch (error) {
//     console.log(error)
//     return res.status(500).json({ msg: error })
//   }
// }
