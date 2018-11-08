Rails.application.routes.draw do
  post 'user_token' => 'user_token#create'
  resources 'user', only: [:index, :create]

  get 'queue' => 'topic#queue'
  post 'correct/:id' => 'topic#correct'
  post 'incorrect/:id' => 'topic#incorrect'

  get 'topic/:id/exercise' => 'topic#question'
  post 'topic/:id/exercise' => 'topic#answer'
end
