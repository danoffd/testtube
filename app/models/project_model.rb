class ProjectModel < ActiveRecord::Base
  belongs_to :Project

  attr_accessible :description, :doit_hours_per_day, :end_date, :name, :start_date
  validates :name, 
    :uniqueness => {:message => "name must be unique", :scope => :project_id}
end
