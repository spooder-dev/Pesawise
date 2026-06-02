import { supabase, BudgetData, SavingsGoal } from './supabase';

export async function loadUserProfile(userId: string) {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('name')
    .eq('id', userId)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function loadBudgetFromSupabase(userId: string): Promise<BudgetData | null> {
  const { data, error } = await supabase
    .from('budgets')
    .select('allowance, data')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  return {
    allowance: Number(data.allowance),
    categories: Array.isArray(data.data) ? data.data : [],
  };
}

export async function saveBudgetToSupabase(userId: string, budget: BudgetData) {
  const { error } = await supabase
    .from('budgets')
    .upsert({
      user_id: userId,
      allowance: budget.allowance,
      data: budget.categories,
      updated_at: new Date().toISOString(),
    });

  if (error) throw error;
}

export async function loadGoalsFromSupabase(userId: string): Promise<SavingsGoal[]> {
  const { data, error } = await supabase
    .from('savings_goals')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;

  return (data || []).map((goal) => ({
    id: goal.id,
    name: goal.name,
    emoji: goal.emoji,
    targetAmount: Number(goal.target_amount),
    savedAmount: Number(goal.saved_amount),
    monthlyContribution: Number(goal.monthly_contribution),
    startDate: goal.start_date,
  }));
}

export async function addGoalToSupabase(userId: string, goal: SavingsGoal) {
  const { error } = await supabase
    .from('savings_goals')
    .insert({
      user_id: userId,
      name: goal.name,
      emoji: goal.emoji,
      target_amount: goal.targetAmount,
      saved_amount: goal.savedAmount,
      monthly_contribution: goal.monthlyContribution,
      start_date: goal.startDate,
    });

  if (error) throw error;
}

export async function updateGoalInSupabase(goalId: string, goal: Partial<SavingsGoal>) {
  const updates: any = {
    updated_at: new Date().toISOString(),
  };
  if (goal.name) updates.name = goal.name;
  if (goal.emoji) updates.emoji = goal.emoji;
  if (goal.targetAmount) updates.target_amount = goal.targetAmount;
  if (goal.savedAmount !== undefined) updates.saved_amount = goal.savedAmount;
  if (goal.monthlyContribution !== undefined) updates.monthly_contribution = goal.monthlyContribution;

  const { error } = await supabase
    .from('savings_goals')
    .update(updates)
    .eq('id', goalId);

  if (error) throw error;
}

export async function deleteGoalFromSupabase(goalId: string) {
  const { error } = await supabase
    .from('savings_goals')
    .delete()
    .eq('id', goalId);

  if (error) throw error;
}

// Lessons Progress
export async function loadLessonsProgress(userId: string) {
  const { data, error } = await supabase
    .from('lessons_progress')
    .select('*')
    .eq('user_id', userId);

  if (error) throw error;
  return (data || []).reduce((acc, lesson) => {
    acc[lesson.lesson_id] = {
      progress: lesson.progress,
      completed: lesson.completed,
      completedAt: lesson.completed_at,
    };
    return acc;
  }, {} as Record<string, any>);
}

export async function updateLessonProgress(userId: string, lessonId: string, progress: number) {
  const { error } = await supabase
    .from('lessons_progress')
    .upsert({
      user_id: userId,
      lesson_id: lessonId,
      progress,
      completed: progress === 100,
      completed_at: progress === 100 ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    }, {
      onConflict: 'user_id,lesson_id',
    });

  if (error) throw error;
}

// Quiz Scores
export async function saveQuizScore(userId: string, lessonId: string, score: number, totalQuestions: number, correctAnswers: number, timeTaken: number) {
  const { error } = await supabase
    .from('quiz_scores')
    .insert({
      user_id: userId,
      lesson_id: lessonId,
      score,
      total_questions: totalQuestions,
      correct_answers: correctAnswers,
      time_taken: timeTaken,
      passed: score >= 70,
    });

  if (error) throw error;
}

export async function loadQuizScores(userId: string, lessonId?: string) {
  let query = supabase
    .from('quiz_scores')
    .select('*')
    .eq('user_id', userId);

  if (lessonId) {
    query = query.eq('lesson_id', lessonId);
  }

  const { data, error } = await query.order('taken_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

// Badges
export async function loadBadges(userId: string) {
  const { data, error } = await supabase
    .from('badges')
    .select('*')
    .eq('user_id', userId)
    .order('earned_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function awardBadge(userId: string, badgeKey: string, badgeName: string, emoji: string, description?: string) {
  const { error } = await supabase
    .from('badges')
    .upsert({
      user_id: userId,
      badge_key: badgeKey,
      badge_name: badgeName,
      emoji,
      description,
    }, {
      onConflict: 'user_id,badge_key',
    });

  if (error) throw error;
}

