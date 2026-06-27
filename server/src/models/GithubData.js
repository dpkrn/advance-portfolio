import mongoose from 'mongoose';

const githubDataSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, trim: true },
    profileUrl: { type: String, trim: true },
    stats: {
      totalCommits: { type: Number, default: 0 },
      totalRepos: { type: Number, default: 0 },
      stars: { type: Number, default: 0 },
      followers: { type: Number, default: 0 },
      contributionsThisYear: { type: Number, default: 0 },
    },
    contributionGraph: { type: mongoose.Schema.Types.Mixed },
    languages: [
      {
        name: { type: String },
        percentage: { type: Number },
        color: { type: String },
      },
    ],
    repositories: [
      {
        name: { type: String },
        description: { type: String },
        stars: { type: Number },
        language: { type: String },
        updated: { type: String },
        url: { type: String },
      },
    ],
    badges: [
      {
        label: { type: String },
        icon: { type: String },
      },
    ],
    activityTimeline: [
      {
        date: { type: String },
        type: { type: String },
        repo: { type: String },
        message: { type: String },
      },
    ],
    config: {
      pinnedRepos:          { type: [String], default: ['devtunnel', 'gotunnel', 'nodetunnel', 'Allin1url'] },
      repoDisplayCount:     { type: Number,   default: 10, min: 1, max: 20 },
      activityDisplayCount: { type: Number,   default: 10, min: 1, max: 20 },
    },
  },
  { timestamps: true }
);

export default mongoose.model('GithubData', githubDataSchema);
