
@projectName = "testtube"

# ###########################################################
# create the root project
@project = Project.where(:name => @projectName).first
if @project == nil
  puts "++++++++ Project not found, creating it"
  @project = Project.create(:name=>@projectName, :description=>"supports mad science")
end

puts "++++++++ Using this project:"
puts @project.inspect

# ###########################################################
# create actors
@actorDoer = @project.project_actors.where(:actor_singular_name => "Doer").first
if @actorDoer == nil
  puts "++++++++  No Doer found, creating one"
  @actorDoer = @project.project_actors.create( \
    :actor_singular_name => "Doer", \
    :actor_plural_name => "Doers", \
    :use_an_instead_of_a =>false)
end
puts "+++++++++ Using this doer"
puts @actorDoer.inspect 

@actorEstimator = @project.project_actors.where(:actor_singular_name => "Estimator").first
if @actorEstimator == nil
  puts "++++++++  No Estimator found, creating one"
  @actorEstimator = @project.project_actors.create( \
    :actor_singular_name => "Estimator", \
    :actor_plural_name => "Estimators", \
    :use_an_instead_of_a =>true)
end
puts "+++++++++ Using this estimator"
puts @actorEstimator.inspect 

@actorReviewer = @project.project_actors.where(:actor_singular_name => "Reviewer").first
if @actorReviewer == nil
  puts "++++++++  No Reviewer found, creating one"
  @actorReviewer = @project.project_actors.create( \
    :actor_singular_name => "Reviewer", \
    :actor_plural_name => "Reviewers", \
    :use_an_instead_of_a =>false)
end
puts "+++++++++ Using this Reviewer"
puts @actorReviewer.inspect 


# ###########################################################
# Create a model
@model = @project.project_models(:name => "First guess").first
if @model == nil
  puts "+++++++++ no model found, creating one"
  @model = @project.project_models.create( \
     :name => "First guess", \
     :description => "taking an initial stab at the estimate", \
     :start_date => Date.parse("25-02-2013"), \
     :end_date => Date.parse("30-03-2013"), \
     :doit_hours_per_day => 6.5)

  #################################
  # - Development story type
  @storyTypeDev = @model.model_story_types.create( \
     :story_type_name => "Development")

  @storyTypeDev.baseline_tasks.create( \
     :name => "Get smart", \
     :description => "Get familliar with reqs, refine details, review related code, etc", \
     :small_doit_loe_hours => 0.5, \
     :is_sensitive_to_size => true, \
     :review_team_size => 1)

  @storyTypeDev.baseline_tasks.create( \
     :name => "Code and unit test", \
     :description => "Develop code, including some testing along the way", \
     :small_doit_loe_hours => 6, \
     :is_sensitive_to_size => true, \
     :review_team_size => 1)

  @storyTypeDev.baseline_tasks.create( \
     :name => "Acceptance testing", \
     :description => "Independently complete the acceptance tests, and ensure regression is in place", \
     :small_doit_loe_hours => 2, \
     :is_sensitive_to_size => true, \
     :review_team_size => 0)

  @storyTypeDev.baseline_tasks.create( \
     :name => "Merge Code", \
     :description => "Merge code with latest set and execute automated regression tests", \
     :small_doit_loe_hours => 0.5, \
     :is_sensitive_to_size => false, \
     :review_team_size => 0)

  @storyTypeDev.baseline_tasks.create( \
     :name => "Code Review", \
     :description => "Perform technical code review with 1 other technical person", \
     :small_doit_loe_hours => 1, \
     :is_sensitive_to_size => false, \
     :review_team_size => 1)
  
  @storyTypeDev.baseline_tasks.create( \
     :name => "Showcase", \
     :description => "Showcase functionality and acceptance tests", \
     :small_doit_loe_hours => 0.5, \
     :is_sensitive_to_size => false, \
     :review_team_size => 4)
  
  @storyTypeDev.baseline_tasks.create( \
     :name => "Support post sprint testing", \
     :description => "Handle bugs and changes that arise after release is final", \
     :small_doit_loe_hours => 3, \
     :is_sensitive_to_size => true, \
     :review_team_size => 1)
  
  
  
  #################################
  # - Spike story type
  @storyTypeSpike = @model.model_story_types.create( \
     :story_type_name => "Spike")

  @storyTypeSpike.baseline_tasks.create( \
     :name => "Define objectives", \
     :description => "Define the objectives of the spike", \
     :small_doit_loe_hours => 0.5, \
     :is_sensitive_to_size => true, \
     :review_team_size => 2)

  @storyTypeSpike.baseline_tasks.create( \
     :name => "Do it", \
     :description => "Do whatever work is required by the spike", \
     :small_doit_loe_hours => 1, \
     :is_sensitive_to_size => true, \
     :review_team_size => 2)

  @storyTypeSpike.baseline_tasks.create( \
     :name => "Review progress and results", \
     :description => "Review the progress of the work and final results", \
     :small_doit_loe_hours => 1, \
     :is_sensitive_to_size => true, \
     :review_team_size => 2)

  #################################
  # - Minor task story type
  @storyTypeTask = @model.model_story_types.create( \
     :story_type_name => "Minor Task")

  @storyTypeTask.baseline_tasks.create( \
     :name => "Define objectives", \
     :description => "Define the objectives of the task", \
     :small_doit_loe_hours => 0.5, \
     :is_sensitive_to_size => true, \
     :review_team_size => 1)

  @storyTypeTask.baseline_tasks.create( \
     :name => "Do it", \
     :description => "Do whatever work is required", \
     :small_doit_loe_hours => 2, \
     :is_sensitive_to_size => true, \
     :review_team_size => 0)

  #################################
  # - Epic
  @storyTypeEpic = @model.model_story_types.create( \
     :story_type_name => "Epic")

  @storyTypeEpic.baseline_tasks.create( \
     :name => "Define Child Stories", \
     :description => "Define the breakdown of stories within the epic", \
     :small_doit_loe_hours => 4, \
     :is_sensitive_to_size => true, \
     :review_team_size => 0)

  @storyTypeEpic.baseline_tasks.create( \
     :name => "Communicate and build consensus", \
     :description => "Communicate the sub-stories, assimilate feedback", \
     :small_doit_loe_hours => 2, \
     :is_sensitive_to_size => true, \
     :review_team_size => 5)
end


# ###########################################################
# Create some stories
puts "+++++++++Creating story: enter work required"

@storyDefineProject = @model.user_stories.create( \
  :ProjectActor_id => @actorEstimator.id, \
  :ModelStoryType_id => @storyTypeEpic.id, \
  :want_to => "enter the work required to complete a project", \
  :so_i_can => "further my understanding of the scope and the effort required to complete it", \
  :priority => 1, \
  :is_fully_recorded => false, \
  :is_estimate_final => false)

@storyDefineProject.story_comments.create( \
  :comment_type => "feedback", \
  :comment => "this is going to be wicked hard, dont underestimate it", \
  :is_satisfied => false)

@storyEstimateProject = @model.user_stories.create( \
  :ProjectActor_id => @actorEstimator.id, \
  :ModelStoryType_id => @storyTypeEpic.id, \
  :want_to => "estimate the project with progressively more detailed information", \
  :so_i_can => "provide as comprehensive an estimate as is possible", \
  :priority => 2, \
  :is_fully_recorded => false, \
  :is_estimate_final => false)

@storyPlanProject = @model.user_stories.create( \
  :ProjectActor_id => @actorEstimator.id, \
  :ModelStoryType_id => @storyTypeEpic.id, \
  :want_to => "use the recorded project information to plan the completion of the project", \
  :so_i_can => "communicate timelines and resource plans", \
  :priority => 3, \
  :is_fully_recorded => false, \
  :is_estimate_final => false)

@storyTrackProject = @model.user_stories.create( \
  :ProjectActor_id => @actorEstimator.id, \
  :ModelStoryType_id => @storyTypeEpic.id, \
  :want_to => "track the progress of the project", \
  :so_i_can => "understand at every point of the project lifecycle where I am", \
  :priority => 4, \
  :is_fully_recorded => false, \
  :is_estimate_final => false)

@storyAssessProject = @model.user_stories.create( \
  :ProjectActor_id => @actorEstimator.id, \
  :ModelStoryType_id => @storyTypeEpic.id, \
  :want_to => "analyze estimates against actual", \
  :so_i_can => "estimate the next project even better", \
  :priority => 5, \
  :is_fully_recorded => false, \
  :is_estimate_final => false)

# ###########################################################
# Done!
puts "+++++++++ all done"



