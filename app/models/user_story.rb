class UserStory < ActiveRecord::Base
  belongs_to :Project
  belongs_to :Actor \
    , :class_name => "Actor" \
    , :foreign_key => "actor_id"
  belongs_to :StoryType
  belongs_to :parent_user_story \
    , :class_name => "UserStory" \
    , :foreign_key => "parent_user_story_id"
  has_many :child_user_stories \
    , :class_name => "UserStory" \
    , :foreign_key => "parent_user_story_id" \
    , :dependent => :delete_all
  
  has_many :story_notes, :dependent => :destroy, :foreign_key => "user_story_id"
  attr_accessible :doit_loe_hours,
    :doit_loe_hours_calculated,
    :fibonacci_estimate,
    :is_estimate_final,
    :is_fully_recorded,
    :priority,
    :so_i_can,
    :want_to,
    :project_id,
    :actor_id,
    :story_type_id,
    :parent_user_story_id
  
  validates :want_to, 
    :uniqueness => {:message => "the want to clause must be unique", :scope => :project_id}
  validates :want_to, :presence => true
  validates :project_id, :presence => true
  validates :actor_id, :presence => true
  validates :story_type_id, :presence => true
  validates :so_i_can, :presence => true
end
