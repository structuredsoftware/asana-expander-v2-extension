export type FeatureSettings = {
  inboxRichText: boolean;
  taskStoryFeed: boolean;
  taskStoryRichText: boolean;
  taskSubtasks: boolean;
  taskProjects: boolean;
};

export const DEFAULT_FEATURE_SETTINGS: FeatureSettings = {
  inboxRichText: true,
  taskStoryFeed: true,
  taskStoryRichText: true,
  taskSubtasks: true,
  taskProjects: true,
};
