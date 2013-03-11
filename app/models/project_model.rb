class ProjectModel < ActiveRecord::Base
  belongs_to :Project
  has_many :model_story_types, :dependent => :destroy, :foreign_key => 'ProjectModel_id'
  has_many :user_stories, :dependent => :destroy, :foreign_key => 'ProjectModel_id'

  attr_accessible :description, :doit_hours_per_day, :end_date, :name, :start_date
  validates :name, 
    :uniqueness => {:message => "name must be unique", :scope => :Project_id}
end
