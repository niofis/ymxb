

macro m {
  rule { ($base) } => { [$base] }
  rule { ($head $tail ...) } => { [$head, m ($tail ...)] }
}
m (1 2 3 4 5) 
