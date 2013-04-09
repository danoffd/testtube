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

ActiveRecord::Schema.define(:version => 20130405225920) do

  create_table "actors", :force => true do |t|
    t.integer  "project_id"
    t.string   "actor_singular_name", :limit => 50
    t.string   "actor_plural_name",   :limit => 50
    t.boolean  "use_an_instead_of_a"
    t.datetime "created_at",                        :null => false
    t.datetime "updated_at",                        :null => false
  end

  add_index "actors", ["project_id"], :name => "index_actors_on_project_id"

  create_table "baseline_tasks", :force => true do |t|
    t.integer  "story_type_id"
    t.string   "name"
    t.string   "description"
    t.decimal  "small_doit_loe_hours", :precision => 10, :scale => 2
    t.boolean  "is_sensitive_to_size"
    t.integer  "review_team_size"
    t.datetime "created_at",                                          :null => false
    t.datetime "updated_at",                                          :null => false
  end

  add_index "baseline_tasks", ["story_type_id"], :name => "index_baseline_tasks_on_story_type_id"

  create_table "invitees", :force => true do |t|
    t.string   "email"
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
  end

  create_table "project_models", :force => true do |t|
    t.integer  "project_id"
    t.string   "name"
    t.string   "description"
    t.datetime "start_date"
    t.datetime "end_date"
    t.decimal  "doit_hours_per_day", :precision => 4, :scale => 2
    t.datetime "created_at",                                       :null => false
    t.datetime "updated_at",                                       :null => false
  end

  add_index "project_models", ["project_id"], :name => "index_project_models_on_project_id"

  create_table "project_users", :force => true do |t|
    t.integer  "project_id"
    t.integer  "user_id"
    t.string   "role"
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
    t.integer  "invitee_id"
  end

  create_table "projects", :force => true do |t|
    t.string   "name",        :limit => 50
    t.string   "description"
    t.datetime "created_at",                :null => false
    t.datetime "updated_at",                :null => false
    t.boolean  "is_public"
  end

  create_table "story_notes", :force => true do |t|
    t.integer  "user_story_id"
    t.text     "note"
    t.string   "note_type"
    t.boolean  "is_satisfied"
    t.datetime "created_at",    :null => false
    t.datetime "updated_at",    :null => false
  end

  add_index "story_notes", ["user_story_id"], :name => "index_story_notes_on_user_story_id"

  create_table "story_tasks", :force => true do |t|
    t.integer  "baseline_task_id"
    t.integer  "user_story_id"
    t.boolean  "is_overridden"
    t.string   "name"
    t.text     "description"
    t.decimal  "doit_loe_hours",   :precision => 10, :scale => 2
    t.datetime "created_at",                                      :null => false
    t.datetime "updated_at",                                      :null => false
  end

  add_index "story_tasks", ["baseline_task_id"], :name => "index_story_tasks_on_baseline_task_id"
  add_index "story_tasks", ["user_story_id"], :name => "index_story_tasks_on_user_story_id"

  create_table "story_types", :force => true do |t|
    t.integer  "project_id"
    t.string   "story_type_name"
    t.datetime "created_at",      :null => false
    t.datetime "updated_at",      :null => false
  end

  add_index "story_types", ["project_id"], :name => "index_story_types_on_project_id"

  create_table "user_stories", :force => true do |t|
    t.integer  "project_id"
    t.integer  "actor_id"
    t.integer  "story_type_id"
    t.integer  "parent_user_story_id"
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

  add_index "user_stories", ["actor_id"], :name => "index_user_stories_on_actor_id"
  add_index "user_stories", ["project_id"], :name => "index_user_stories_on_project_id"
  add_index "user_stories", ["story_type_id"], :name => "index_user_stories_on_story_type_id"

  create_table "users", :force => true do |t|
    t.string   "email",                  :default => "", :null => false
    t.string   "encrypted_password",     :default => "", :null => false
    t.string   "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer  "sign_in_count",          :default => 0
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.string   "current_sign_in_ip"
    t.string   "last_sign_in_ip"
    t.datetime "created_at",                             :null => false
    t.datetime "updated_at",                             :null => false
    t.string   "provider"
    t.string   "uid"
  end

  add_index "users", ["email"], :name => "index_users_on_email", :unique => true
  add_index "users", ["reset_password_token"], :name => "index_users_on_reset_password_token", :unique => true

end
