export type AboutUs = {
  date_created?: string;
  date_updated?: string;
  id: number;
  sort?: number;
  status: string;
  text_de?: string;
  user_created?: string & DirectusUsers;
  user_updated?: string & DirectusUsers;
};

export type Apartments = {
  id: number;
  status: string;
  sort?: number;
  user_created?: string & DirectusUsers;
  date_created?: string;
  user_updated?: string & DirectusUsers;
  date_updated?: string;
  building?: number & Buildings;
  available_from?: string;
  family_friendly?: boolean;
  handicapped_accessible?: boolean;
  singleflat?: boolean;
};

export type AppFeedbacks = {
  id: number;
  status: string;
  sort?: number;
  user_created?: string & DirectusUsers;
  date_created?: string;
  user_updated?: string & DirectusUsers;
  date_updated?: string;
  profile?: number & Profiles;
  title?: string;
  content?: string;
  image?: string & DirectusFiles;
  type?: string;
};

export type AppSettings = {
  avatars_enabled?: boolean;
  date_created?: string;
  date_updated?: string;
  enabledAvatarStyles?: string;
  id: number;
  initialAvatarStyle?: string;
  foodplaceholder_image?: string & DirectusFiles;
  status: string;
  user_created?: string & DirectusUsers;
  user_updated?: string & DirectusUsers;
  avatars_settings_group: string;
};

export type AppSettingsAccountBalance = {
  id: number;
  status: string;
  user_created?: string & DirectusUsers;
  date_created?: string;
  user_updated?: string & DirectusUsers;
  date_updated?: string;
  enabled?: boolean;
};

export type AppSettingsBuildings = {
  id: number;
  status: string;
  user_created?: string & DirectusUsers;
  date_created?: string;
  user_updated?: string & DirectusUsers;
  date_updated?: string;
  enabled?: boolean;
};

export type AppSettingsHousing = {
  id: number;
  status: string;
  user_created?: string & DirectusUsers;
  date_created?: string;
  user_updated?: string & DirectusUsers;
  date_updated?: string;
  enabled?: boolean;
  maps_enabled?: boolean;
  translations: string & AppSettingsHousingTranslations[];
};

export type AppSettingsHousingTranslations = {
  id: number;
  app_settings_housing_id?: number & AppSettingsHousing;
  languages_code?: string & Languages;
  description?: string;
  be_source_for_translations?: boolean;
  let_be_translated?: boolean;
  create_translations_for_all_languages?: boolean;
};

export type AppSettingsFoods = {
  id: number;
  status: string;
  user_created?: string & DirectusUsers;
  date_created?: string;
  user_updated?: string & DirectusUsers;
  date_updated?: string;
  comments_type?: string;
  ratings_type?: string;
  ratings_avg_display?: boolean;
  ratings_amount_display?: boolean;
  placeholder_image?: string & DirectusFiles;
  enabled?: boolean;
};

export type AppSettingsNews = {
  id: number;
  status: string;
  user_created?: string & DirectusUsers;
  date_created?: string;
  date_updated?: string;
  enabled?: boolean;
};

export type AppSettingsNotifications = {
  id: number;
  status: string;
  user_created?: string & DirectusUsers;
  date_created?: string;
  user_updated?: string & DirectusUsers;
  date_updated?: string;
  android_enabled?: boolean;
  ios_enabled?: boolean;
  email_enabled?: boolean;
};

export type AppTranslations = {
  date_created?: string;
  date_updated?: string;
  id: string;
  sort?: number;
  status?: string;
  user_created?: string & DirectusUsers;
  user_updated?: string & DirectusUsers;
  translations: string & AppTranslationsTranslations[];
};

export type AppTranslationsTranslations = {
  app_translations_id?: string & AppTranslations;
  be_source_for_translations?: boolean;
  content?: string;
  create_translations_for_all_languages?: boolean;
  id: number;
  languages_code?: string & Languages;
  let_be_translated?: boolean;
  translation: string;
};

export type AutoBackupSettings = {
  DB_CLIENT?: string;
  active?: boolean;
  backup_file_format?: string;
  backup_file_format_postfix?: string;
  backup_file_format_prefix?: string;
  backup_location_custom_path?: string;
  backup_location_folder_id?: string;
  backup_location_folder_name?: string;
  backup_location_type?: string;
  date_created?: string;
  date_updated?: string;
  id: number;
  latest_log?: string;
  sqlite3_db_filename?: string;
  state?: string;
  user_created?: string;
  user_updated?: string;
  backup_location_type_custom: string;
  backup_location_type_file_library: string;
  divide_to_database_type: string;
  divider-oql-hz: string;
  divider-qtbpzx: string;
  divider_to_backup_location: string;
  driver_specific_settings: string;
  general_settings: string;
  notice_finished: string;
  notice_please_configure_db_client: string;
  notice_please_configure_save_location: string;
  notice_please_setup_name_for_backupfile: string;
  notice_welcome: string;
  sqlite3_settings: string;
  visibility_active: string;
};

export type AutoTranslationSettings = {
  active?: boolean;
  auth_key?: string;
  extra?: string;
  id: number;
  informations?: string;
  limit?: number;
  percentage?: number;
  used?: number;
  valid_auth_key?: boolean;
  notice: string;
  usage: string;
  visible_for_valid_auth_key: string;
};

export type Buildings = {
  id: number;
  status: string;
  sort?: number;
  user_created?: string & DirectusUsers;
  date_created?: string;
  user_updated?: string & DirectusUsers;
  date_updated?: string;
  name?: string;
  coord?: unknown;
  image?: string & DirectusFiles;
  year_of_construction?: number;
  translations: string & BuildingsTranslations[];
  canteens: string & Canteens[];
  apartments: string & Apartments[];
};

export type BuildingsTranslations = {
  id: number;
  buildings_id?: number & Buildings;
  languages_code?: string & Languages;
  create_translations_for_all_languages?: boolean;
  be_source_for_translations?: boolean;
  let_be_translated?: boolean;
  content?: string;
  translation: string;
};

export type Businesshours = {
  id: number;
  status: string;
  sort?: number;
  user_created?: string & DirectusUsers;
  date_created?: string;
  user_updated?: string & DirectusUsers;
  date_updated?: string;
  time_start?: string;
  time_end?: string;
  dayOfTheWeek?: string;
  date_valid_from?: string;
  date_valid_till?: string;
};

export type Canteens = {
  date_created?: string;
  date_updated?: string;
  id: number;
  label?: string;
  sort?: number;
  status: string;
  user_created?: string & DirectusUsers;
  user_updated?: string & DirectusUsers;
  building?: number & Buildings;
  businesshours: string & CanteensBusinesshours[];
};

export type CanteensBusinesshours = {
  id: number;
  canteens_id?: number & Canteens;
  businesshours_id?: number & Businesshours;
};

export type Chatrooms = {
  id: number;
  status: string;
  sort?: number;
  user_created?: string & DirectusUsers;
  date_created?: string;
  user_updated?: string & DirectusUsers;
  date_updated?: string;
  owner?: number & Profiles;
};

export type Devices = {
  date_created?: string;
  date_updated?: string;
  id: number;
  sort?: number;
  status: string;
  user_created?: string & DirectusUsers;
  user_updated?: string & DirectusUsers;
  profile?: number & Profiles;
  isSimulator?: boolean;
  isTablet?: boolean;
  platform?: string;
  brand?: string;
  systemVersion?: string;
  pushTokenObj?: unknown;
  display_width?: string;
  display_height?: string;
  display_scale?: string;
  display_pixelratio?: string;
  display_fontscale?: string;
  deviceFingerprint?: string;
  isIOS?: boolean;
  isAndroid?: boolean;
  isWeb?: boolean;
  isLandscape?: boolean;
  display_group: string;
  system_group: string;
};

export type Flowhooks = {
  date_created?: string;
  date_updated?: string;
  id: number;
  last_parsing_date?: string;
  status: string;
  user_created?: string & DirectusUsers;
  user_updated?: string & DirectusUsers;
  parse_foodoffers?: string;
};

export type Foodoffers = {
  id: number;
  status: string;
  sort?: number;
  user_created?: string & DirectusUsers;
  date_created?: string;
  user_updated?: string & DirectusUsers;
  date_updated?: string;
  food?: string & Foods;
  price_employee?: number;
  price_guest?: number;
  pice_student?: number;
  date?: string;
  canteen?: number & Canteens;
  markings: string & FoodoffersMarkings[];
};

export type FoodoffersMarkings = {
  id: number;
  foodoffers_id?: number & Foodoffers;
  markings_id?: number & Markings;
};

export type Foods = {
  id: string;
  status: string;
  sort?: number;
  user_created?: string & DirectusUsers;
  date_created?: string;
  user_updated?: string & DirectusUsers;
  date_updated?: string;
  calories_kcal?: number;
  carbohydrate_g?: number;
  extra?: unknown;
  fat_g?: number;
  fiber_g?: number;
  image?: string & DirectusFiles;
  protein_g?: number;
  saturated_fat_g?: number;
  sodium_g?: number;
  sugar_g?: number;
  feedbacks: string & FoodsFeedbacks[];
  markings: string & FoodsMarkings[];
  translations: string & FoodsTranslations[];
};

export type FoodsFeedbacks = {
  id: number;
  foods_id?: string & Foods;
  profiles_id?: number & Profiles;
};

export type FoodsMarkings = {
  id: number;
  foods_id?: string & Foods;
  markings_id?: number & Markings;
};

export type FoodsTranslations = {
  id: number;
  foods_id?: string & Foods;
  languages_code?: string & Languages;
  name?: string;
};

export type ImageOverlays = {
  id: string;
  status: string;
  sort?: number;
  user_created?: string & DirectusUsers;
  date_created?: string;
  user_updated?: string & DirectusUsers;
  date_updated?: string;
  icon?: string;
  image?: string & DirectusFiles;
  color?: string;
  position?: string;
  translations: string & ImageOverlaysTranslations[];
};

export type ImageOverlaysTranslations = {
  id: number;
  image_overlays_id?: string & ImageOverlays;
  languages_code?: string & Languages;
  title?: string;
  description?: string;
};

export type Languages = {
  code: string;
  direction?: string;
  name?: string;
};

export type Markings = {
  date_created?: string;
  date_updated?: string;
  id: number;
  label?: string;
  name?: string;
  sort?: number;
  status: string;
  user_created?: string & DirectusUsers;
  user_updated?: string & DirectusUsers;
  translations: string & MarkingsTranslations[];
};

export type MarkingsTranslations = {
  id: number;
  markings_id?: number & Markings;
  languages_code?: string & Languages;
  be_source_for_translations?: boolean;
  let_be_translated?: boolean;
  create_translations_for_all_languages?: boolean;
  name?: string;
};

export type FoodoffersMarkings = {
  id: number;
  markings_id?: number & Markings;
};

export type FoodsFeedbacks = {
  canteens_id?: number & Canteens;
  comment?: string;
  id: number;
  profiles_id?: number & Profiles;
  rating?: number;
  date_created?: string;
  date_updated?: string;
};

export type FoodsMarkings = {
  id: number;
  markings_id?: number & Markings;
};

export type FoodsTranslations = {
  id: number;
  languages_code?: string & Languages;
  name?: string;
};

export type News = {
  date_created?: string;
  date_updated?: string;
  id: number;
  image?: string & DirectusFiles;
  sort?: number;
  status: string;
  user_created?: string & DirectusUsers;
  user_updated?: string & DirectusUsers;
  notice_private?: string;
  url?: string;
  translations: string & NewsTranslations[];
};

export type NewsTranslations = {
  be_source_for_translations?: boolean;
  content?: string;
  create_translations_for_all_languages?: boolean;
  id: number;
  languages_code?: string & Languages;
  let_be_translated?: boolean;
  news_id?: number & News;
  title?: string;
  translation: string;
};

export type PrivacyPolicy = {
  date_created?: string;
  date_updated?: string;
  id: number;
  status: string;
  text_de?: string;
  user_created?: string & DirectusUsers;
  user_updated?: string & DirectusUsers;
};

export type Profiles = {
  id: number;
  status: string;
  sort?: number;
  user_created?: string & DirectusUsers;
  date_created?: string;
  user_updated?: string & DirectusUsers;
  date_updated?: string;
  avatar?: unknown;
  canteen?: number & Canteens;
  credit_balance?: number;
  language?: string;
  nickname?: string;
  markings: string & ProfilesMarkings[];
  devices: string & Devices[];
  buildings_favorites: string & ProfilesBuildingsFavorites[];
  foods_feedbacks: string & FoodsFeedbacks[];
};

export type ProfilesBuildingsFavorites = {
  id: number;
  profiles_id?: number & Profiles;
  buildings_id?: number & Buildings;
};

export type ProfilesMarkings = {
  dislikes?: boolean;
  id: number;
  markings_id?: number & Markings;
  profiles_id?: number & Profiles;
};

export type Washingmachines = {
  id: number;
  status: string;
  sort?: number;
  user_created?: string & DirectusUsers;
  date_created?: string;
  user_updated?: string & DirectusUsers;
  date_updated?: string;
  apartment?: number & Apartments;
  minutes_remaining?: number;
};

export type Wikis = {
  date_created?: string;
  date_updated?: string;
  icon?: string;
  id: number;
  parent?: number & Wikis;
  public?: boolean;
  role?: string & DirectusRoles;
  sort?: number;
  status: string;
  user_created?: string & DirectusUsers;
  user_updated?: string & DirectusUsers;
  hideAsNormalWiki?: boolean;
  custom_id?: string;
  notice_private?: string;
  color?: string;
  translations: string & WikisTranslations[];
  children: string & Wikis[];
};

export type WikisTranslations = {
  id: number;
  wikis_id?: number & Wikis;
  languages_code?: string & Languages;
  title?: string;
  content?: string;
  be_source_for_translations?: boolean;
  let_be_translated?: boolean;
  create_translations_for_all_languages?: boolean;
  translation: string;
};

export type DirectusActivity = {
  id: number;
  action: string;
  user?: string & DirectusUsers;
  timestamp: string;
  ip?: string;
  user_agent?: string;
  collection: string;
  item: string;
  comment?: string;
  origin?: string;
  revisions: string & DirectusRevisions[];
};

export type DirectusCollections = {
  collection: string;
  icon?: string;
  note?: string;
  display_template?: string;
  hidden: boolean;
  singleton: boolean;
  translations?: unknown;
  archive_field?: string;
  archive_app_filter: boolean;
  archive_value?: string;
  unarchive_value?: string;
  sort_field?: string;
  accountability?: string;
  color?: string;
  item_duplication_fields?: unknown;
  sort?: number;
  group?: string & DirectusCollections;
  collapse: string;
  collection_divider: string;
  archive_divider: string;
  sort_divider: string;
  accountability_divider: string;
  duplication_divider: string;
};

export type DirectusFields = {
  id: number;
  collection: string & DirectusCollections;
  field: string;
  special?: unknown;
  interface?: string;
  options?: unknown;
  display?: string;
  display_options?: unknown;
  readonly: boolean;
  hidden: boolean;
  sort?: number;
  width?: string;
  translations?: unknown;
  note?: string;
  conditions?: unknown;
  required?: boolean;
  group?: string & DirectusFields;
  validation?: unknown;
  validation_message?: string;
};

export type DirectusFiles = {
  id: string;
  storage: string;
  filename_disk?: string;
  filename_download: string;
  title?: string;
  type?: string;
  folder?: string & DirectusFolders;
  uploaded_by?: string & DirectusUsers;
  uploaded_on: string;
  modified_by?: string & DirectusUsers;
  modified_on: string;
  charset?: string;
  filesize?: number;
  width?: number;
  height?: number;
  duration?: number;
  embed?: string;
  description?: string;
  location?: string;
  tags?: unknown;
  metadata?: unknown;
  storage_divider: string;
};

export type DirectusFolders = {
  id: string;
  name: string;
  parent?: string & DirectusFolders;
};

export type DirectusMigrations = {
  version: string;
  name: string;
  timestamp?: string;
};

export type DirectusPermissions = {
  id: number;
  role?: string & DirectusRoles;
  collection: string;
  action: string;
  permissions?: unknown;
  validation?: unknown;
  presets?: unknown;
  fields?: unknown;
};

export type DirectusPresets = {
  id: number;
  bookmark?: string;
  user?: string & DirectusUsers;
  role?: string & DirectusRoles;
  collection?: string;
  search?: string;
  layout?: string;
  layout_query?: unknown;
  layout_options?: unknown;
  refresh_interval?: number;
  filter?: unknown;
  icon: string;
  color?: string;
};

export type DirectusRelations = {
  id: number;
  many_collection: string;
  many_field: string;
  one_collection?: string;
  one_field?: string;
  one_collection_field?: string;
  one_allowed_collections?: unknown;
  junction_field?: string;
  sort_field?: string;
  one_deselect_action: string;
};

export type DirectusRevisions = {
  id: number;
  activity: number & DirectusActivity;
  collection: string;
  item: string;
  data?: unknown;
  delta?: unknown;
  parent?: number & DirectusRevisions;
};

export type DirectusRoles = {
  id: string;
  name: string;
  icon: string;
  description?: string;
  ip_access?: unknown;
  enforce_tfa: boolean;
  admin_access: boolean;
  app_access: boolean;
  users: string & DirectusUsers[];
};

export type DirectusSessions = {
  token: string;
  user?: string & DirectusUsers;
  expires: string;
  ip?: string;
  user_agent?: string;
  share?: string & DirectusShares;
  origin?: string;
};

export type DirectusSettings = {
  id: number;
  project_name: string;
  project_url?: string;
  project_color?: string;
  project_logo?: string & DirectusFiles;
  public_foreground?: string & DirectusFiles;
  public_background?: string & DirectusFiles;
  public_note?: string;
  auth_login_attempts?: number;
  auth_password_policy?: string;
  storage_asset_transform?: string;
  storage_asset_presets?: unknown;
  custom_css?: string;
  storage_default_folder?: string & DirectusFolders;
  basemaps?: unknown;
  mapbox_key?: string;
  module_bar?: unknown;
  project_descriptor?: string;
  translation_strings?: unknown;
  default_language: string;
  custom_aspect_ratios?: unknown;
  branding_divider: string;
  modules_divider: string;
  security_divider: string;
  files_divider: string;
  map_divider: string;
  image_editor: string;
};

export type DirectusUsers = {
  id: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  password?: string;
  location?: string;
  title?: string;
  description?: string;
  tags?: unknown;
  avatar?: string & DirectusFiles;
  language?: string;
  theme?: string;
  tfa_secret?: string;
  status: string;
  role?: string & DirectusRoles;
  token?: string;
  last_access?: string;
  last_page?: string;
  provider: string;
  external_identifier?: string;
  auth_data?: unknown;
  email_notifications?: boolean;
  profile?: number & Profiles;
  preferences_divider: string;
  admin_divider: string;
};

export type DirectusWebhooks = {
  id: number;
  name: string;
  method: string;
  url: string;
  status: string;
  data: boolean;
  actions: unknown;
  collections: unknown;
  headers?: unknown;
  triggers_divider: string;
};

export type DirectusDashboards = {
  id: string;
  name: string;
  icon: string;
  note?: string;
  date_created?: string;
  user_created?: string & DirectusUsers;
  color?: string;
  panels: string & DirectusPanels[];
};

export type DirectusPanels = {
  id: string;
  dashboard: string & DirectusDashboards;
  name?: string;
  icon?: string;
  color?: string;
  show_header: boolean;
  note?: string;
  type: string;
  position_x: number;
  position_y: number;
  width: number;
  height: number;
  options?: unknown;
  date_created?: string;
  user_created?: string & DirectusUsers;
};

export type DirectusNotifications = {
  id: number;
  timestamp?: string;
  status?: string;
  recipient: string & DirectusUsers;
  sender?: string & DirectusUsers;
  subject: string;
  message?: string;
  collection?: string;
  item?: string;
};

export type DirectusShares = {
  id: string;
  name?: string;
  collection?: string & DirectusCollections;
  item?: string;
  role?: string & DirectusRoles;
  password?: string;
  user_created?: string & DirectusUsers;
  date_created?: string;
  date_start?: string;
  date_end?: string;
  times_used?: number;
  max_uses?: number;
};

export type DirectusFlows = {
  id: string;
  name: string;
  icon?: string;
  color?: string;
  description?: string;
  status: string;
  trigger?: string;
  accountability?: string;
  options?: unknown;
  operation?: string & DirectusOperations;
  date_created?: string;
  user_created?: string & DirectusUsers;
  operations: string & DirectusOperations[];
};

export type DirectusOperations = {
  id: string;
  name?: string;
  key: string;
  type: string;
  position_x: number;
  position_y: number;
  options?: unknown;
  resolve?: string & DirectusOperations;
  reject?: string & DirectusOperations;
  flow: string & DirectusFlows;
  date_created?: string;
  user_created?: string & DirectusUsers;
};

export type CustomDirectusTypes = {
  about_us: AboutUs;
  apartments: Apartments;
  app_settings: AppSettings;
  app_settings_account_balance: AppSettingsAccountBalance;
  app_settings_buildings: AppSettingsBuildings;
  app_settings_housing: AppSettingsHousing;
  app_settings_housing_translations: AppSettingsHousingTranslations;
  app_settings_foods: AppSettingsFoods;
  app_settings_news: AppSettingsNews;
  app_settings_notifications: AppSettingsNotifications;
  app_translations: AppTranslations;
  app_translations_translations: AppTranslationsTranslations;
  auto_backup_settings: AutoBackupSettings;
  auto_translation_settings: AutoTranslationSettings;
  buildings: Buildings;
  buildings_translations: BuildingsTranslations;
  businesshours: Businesshours;
  canteens: Canteens;
  canteens_businesshours: CanteensBusinesshours;
  chatrooms: Chatrooms;
  devices: Devices;
  flowhooks: Flowhooks;
  foodoffers: Foodoffers;
  foodoffers_markings: FoodoffersMarkings;
  foods: Foods;
  foods_feedbacks: FoodsFeedbacks;
  foods_markings: FoodsMarkings;
  foods_translations: FoodsTranslations;
  image_overlays: ImageOverlays;
  image_overlays_translations: ImageOverlaysTranslations;
  languages: Languages;
  markings: Markings;
  markings_translations: MarkingsTranslations;
  foodoffers_markings: FoodoffersMarkings;
  foods_feedbacks: FoodsFeedbacks;
  foods_markings: FoodsMarkings;
  foods_translations: FoodsTranslations;
  news: News;
  news_translations: NewsTranslations;
  privacy_policy: PrivacyPolicy;
  profiles: Profiles;
  profiles_buildings_favorites: ProfilesBuildingsFavorites;
  profiles_markings: ProfilesMarkings;
  washingmachines: Washingmachines;
  wikis: Wikis;
  wikis_translations: WikisTranslations;
  directus_activity: DirectusActivity;
  directus_collections: DirectusCollections;
  directus_fields: DirectusFields;
  directus_files: DirectusFiles;
  directus_folders: DirectusFolders;
  directus_migrations: DirectusMigrations;
  directus_permissions: DirectusPermissions;
  directus_presets: DirectusPresets;
  directus_relations: DirectusRelations;
  directus_revisions: DirectusRevisions;
  directus_roles: DirectusRoles;
  directus_sessions: DirectusSessions;
  directus_settings: DirectusSettings;
  directus_users: DirectusUsers;
  directus_webhooks: DirectusWebhooks;
  directus_dashboards: DirectusDashboards;
  directus_panels: DirectusPanels;
  directus_notifications: DirectusNotifications;
  directus_shares: DirectusShares;
  directus_flows: DirectusFlows;
  directus_operations: DirectusOperations;
};
