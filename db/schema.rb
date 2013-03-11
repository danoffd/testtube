# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended to check this file into your version control system.

ActiveRecord::Schema.define(:version => 20130226145530) do

  create_table "baseline_tasks", :force => true do |t|
    t.integer  "ModelStoryType_id"
    t.string   "name"
    t.string   "description"
    t.decimal  "small_doit_loe_hours", :precision => 10, :scale => 2
    t.boolean  "is_sensitive_to_size"
    t.integer  "review_team_size"
    t.datetime "created_at",                                          :null => false
    t.datetime "updated_at",                                          :null => false
  end

  add_index "baseline_tasks", ["ModelStoryType_id"], :name => "index_baseline_tasks_on_ModelStoryType_id"

  create_table "model_story_types", :force => true do |t|
    t.integer  "ProjectModel_id"
    t.string   "story_type_name"
    t.datetime "created_at",      :null => false
    t.datetime "updated_at",      :null => false
  end

  add_index "model_story_types", ["ProjectModel_id"], :name => "index_model_story_types_on_ProjectModel_id"

  create_table "project_actors", :force => true do |t|
    t.integer  "Project_id"
    t.string   "actor_singular_name"
    t.string   "actor_plural_name"
    t.boolean  "use_an_instead_of_a"
    t.datetime "created_at",          :null => false
    t.datetime "updated_at",          :null => false
  end

  add_index "project_actors", ["Project_id"], :name => "index_project_actors_on_Project_id"

  create_table "project_models", :force => true do |t|
    t.integer  "Project_id"
    t.string   "name"
    t.string   "description"
    t.datetime "start_date"
    t.datetime "end_date"
    t.decimal  "doit_hours_per_day", :precision => 4, :scale => 2
    t.datetime "created_at",                                       :null => false
    t.datetime "updated_at",                                       :null => false
  end

  add_index "project_models", ["Project_id"], :name => "index_project_models_on_Project_id"

  create_table "projects", :force => true do |t|
    t.string   "name"
    t.string   "description"
    t.datetime "created_at",  :null => false
    t.datetime "updated_at",  :null => false
  end

  create_table "story_comments", :force => true do |t|
    t.integer  "UserStory_id"
    t.text     "comment"
    t.string   "comment_type"
    t.boolean  "is_satisfied"
    t.datetime "created_at",   :null => false
    t.datetime "updated_at",   :null => false
  end

  add_index "story_comments", ["UserStory_id"], :name => "index_story_comments_on_UserStory_id"

  create_table "story_tasks", :force => true do |t|
    t.integer  "BaselineTask_id"
    t.integer  "UserStory_id"
    t.boolean  "is_overridden"
    t.string   "name"
    t.text     "description"
    t.decimal  "doit_loe_hours",  :precision => 10, :scale => 2
    t.datetime "created_at",                                     :null => false
    t.datetime "updated_at",                                     :null => false
  end

  add_index "story_tasks", ["BaselineTask_id"], :name => "index_story_tasks_on_BaselineTask_id"
  add_index "story_tasks", ["UserStory_id"], :name => "index_story_tasks_on_UserStory_id"

  create_table "user_stories", :force => true do |t|
    t.integer  "ProjectModel_id"
    t.integer  "ProjectActor_id"
    t.integer  "ModelStoryType_id"
    t.string   "want_to"
    t.string   "so_i_can"
    t.decimal  "doit_loe_hours_calculated", :precision => 10, :scale => 2
    t.decimal  "doit_loe_hours_manual",     :precision => 10, :scale => 2
    t.integer  "fibonacci_estimate"
    t.integer  "priority"
    t.boolean  "is_fully_recorded"
    t.boolean  "is_estimate_final"
    t.datetime "created_at",                                               :null => false
    t.datetime "updated_at",                                               :null => false
  end

  add_index "user_stories", ["ModelStoryType_id"], :name => "index_user_stories_on_ModelStoryType_id"
  add_index "user_stories", ["ProjectActor_id"], :name => "index_user_stories_on_ProjectActor_id"
  add_index "user_stories", ["ProjectModel_id"], :name => "index_user_stories_on_ProjectModel_id"

end
