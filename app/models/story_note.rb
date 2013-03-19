class StoryNote < ActiveRecord::Base
  belongs_to :UserStory
  attr_accessible :note, :note_type, :is_satisfied
  
  validates :note, :note_type, :presence => true

  NOTETYPE_acceptance = "acceptance"
  NOTETYPE_feedback = "feedback"
  NOTETYPE_question = "question"
  NOTETYPE_spec = "spec"
  NOTETYPE_remark = "remark"

  ALL_NOTETYPES = [NOTETYPE_acceptance \
    , NOTETYPE_feedback \
    , NOTETYPE_question \
    , NOTETYPE_remark \
    , NOTETYPE_spec]

  validates_inclusion_of :note_type, :in => ALL_NOTETYPES
end
