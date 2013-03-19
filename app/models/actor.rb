class Actor < ActiveRecord::Base
  belongs_to :Project
  has_many :user_stories, :dependent => :destroy, :foreign_key => 'actor_id'

  attr_accessible :actor_plural_name, :actor_singular_name, :use_an_instead_of_a
  validates :actor_singular_name, 
    :uniqueness => {:message => "singular name must be unique", :scope => :project_id}
  validates :actor_plural_name, 
    :uniqueness => {:message => "plural name must be unique", :scope => :project_id}

  def to_s
    actor_singular_name
  end
end
