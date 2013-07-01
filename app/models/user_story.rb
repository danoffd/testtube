class UserStory < ActiveRecord::Base
  belongs_to :project
  belongs_to :actor \
    , :foreign_key => "actor_id"
  belongs_to :story_type
  belongs_to :parent_user_story \
    , :class_name => "UserStory" \
    , :foreign_key => "parent_user_story_id"
  has_many :child_user_stories \
    , :class_name => "UserStory" \
    , :foreign_key => "parent_user_story_id" \
    , :dependent => :delete_all
    
  has_many :notes, :as => :notable
  accepts_nested_attributes_for :notes
  
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
    :parent_user_story_id,
    :actor_name,
    :stack_rank,
    :notes_attributes

  attr_accessor :actor_name
  
  validates :want_to, 
    :uniqueness => {:message => "the want to clause must be unique", :scope => :project_id}
  validates :want_to, :presence => true
  validates :project_id, :presence => true
  validates :actor_id, :presence => true

  # by default, sort by project, parent_user_story, stack_rank, priority, and id
  default_scope order('project_id, parent_user_story_id, stack_rank, priority, id')

  def actor_name
    actor.actor_singular_name if !actor.nil?
  end
end
