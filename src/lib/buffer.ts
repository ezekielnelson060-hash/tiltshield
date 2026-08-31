/** Income → buffer targets */

export function computeBufferPlan(input: {
  monthlyIncome: number;
  monthlyExpenses: number;
  emergencyFundMonths: number;
  targetMonths?: number;
}) {
  const income = Math.max(0, input.monthlyIncome || 0);
  const expenses = Math.max(0, input.monthlyExpenses || 0);
  const months = Math.max(0, input.emergencyFundMonths || 0);
  const targetMonths = input.targetMonths ?? 3;

  const savings = months * expenses;
  const targetSavings = expenses * targetMonths;
  const gap = Math.max(0, targetSavings - savings);
  const surplus = Math.max(0, income - expenses);
  const runwayDays = Math.round(months * 30);

  let weeklyTransfer = 0;
  let weeksToTarget: number | null = null;
  if (gap > 0 && surplus > 0) {
    const sixMonthWeekly = gap / 26;
    const tenPercentWeekly = (surplus * 0.1) / 4.33;
    weeklyTransfer = Math.round(
      Math.min(sixMonthWeekly, Math.max(tenPercentWeekly, surplus / 8))
    );
    if (weeklyTransfer < 5 && surplus >= 5) {
      weeklyTransfer = Math.round(Math.min(surplus / 4, gap));
    }
    if (weeklyTransfer > 0) {
      weeksToTarget = Math.ceil(gap / weeklyTransfer);
    }
  }

  const savingsRate =
    income > 0 ? Math.round(((income - expenses) / income) * 100) : 0;

  return {
    income,
    expenses,
    surplus,
    savings: Math.round(savings),
    targetSavings: Math.round(targetSavings),
    gap: Math.round(gap),
    runwayDays,
    targetMonths,
    weeklyTransfer,
    weeksToTarget,
    savingsRate,
    onTrack: gap <= 0,
  };
}
